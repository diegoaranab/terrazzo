#!/usr/bin/env node

import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const siteBasePath = '/terrazzo/';
const validMenuCategories = new Set(['hamburguesas', 'alitas', 'jochos', 'nachos', 'cocteleria']);
const genericGalleryAlts = new Set(['foto', 'foto 1', 'imagen', 'image', 'gallery image']);
const numberedGenericGalleryAltPattern = /^(foto|imagen|image) \d+$/;

const files = [
  {
    filePath: 'assets/menu.json',
    validate: validateMenu
  },
  {
    filePath: 'assets/events.json',
    validate: validateEvents
  },
  {
    filePath: 'assets/gallery.json',
    validate: validateGallery
  }
];

let hasErrors = false;

for (const fileConfig of files) {
  await validateFile(fileConfig);
}

process.exit(hasErrors ? 1 : 0);

async function validateFile({ filePath, validate }) {
  let data;
  const errors = [];
  const warnings = [];

  try {
    const raw = await fs.readFile(path.join(repoRoot, filePath), 'utf8');
    data = JSON.parse(raw);
  } catch (error) {
    fail(`${filePath}: ${error.message}`);
    return;
  }

  if (!Array.isArray(data)) {
    fail(`${filePath}: expected a JSON array`);
    return;
  }

  if (data.length === 0) {
    fail(`${filePath}: array must not be empty`);
    return;
  }

  validate(data, filePath, errors, warnings);

  printWarnings(warnings);

  if (errors.length > 0) {
    for (const error of errors) {
      fail(error);
    }
    return;
  }

  console.log(`✅ ${filePath} passed`);
}

function validateMenu(items, filePath, errors, warnings) {
  const seenIds = new Set();

  items.forEach((item, index) => {
    if (!validateObjectItem(item, filePath, index, errors)) {
      return;
    }

    const label = itemLabel(item, index);
    validateRequiredFields(item, filePath, label, ['id', 'category', 'name', 'description', 'price', 'img'], errors);

    if (!isNonEmptyString(item.id)) {
      errors.push(`${filePath} item ${label}: "id" must be a non-empty string`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${filePath} item ${label}: duplicate id "${item.id}"`);
    } else {
      seenIds.add(item.id);
    }

    if (!validMenuCategories.has(item.category)) {
      errors.push(`${filePath} item ${label}: invalid category "${String(item.category)}"`);
    }

    validateNonEmptyStringField(item, 'name', filePath, label, errors);
    validateNonEmptyStringField(item, 'description', filePath, label, errors);

    if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
      errors.push(`${filePath} item ${label}: "price" must be a finite number greater than or equal to 0`);
    }

    if (!isNonEmptyString(item.img)) {
      errors.push(`${filePath} item ${label}: "img" must be a non-empty string`);
    } else {
      if (!item.img.startsWith('/terrazzo/assets/')) {
        errors.push(`${filePath} item ${label}: "img" must start with /terrazzo/assets/`);
      } else {
        validateReferencedAssetExists(item.img, filePath, label, 'img', errors);
      }

      if (!hasExtension(item.img, '.webp')) {
        warnings.push(`${filePath} item ${label}: image is ${extensionName(item.img)}; WebP recommended for future optimization`);
      }
    }
  });
}

function validateEvents(items, filePath, errors) {
  const seenIds = new Set();

  items.forEach((item, index) => {
    if (!validateObjectItem(item, filePath, index, errors)) {
      return;
    }

    const label = itemLabel(item, index);
    validateRequiredFields(item, filePath, label, ['id', 'title', 'date', 'description', 'img'], errors);

    if (!isNonEmptyString(item.id)) {
      errors.push(`${filePath} item ${label}: "id" must be a non-empty string`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${filePath} item ${label}: duplicate id "${item.id}"`);
    } else {
      seenIds.add(item.id);
    }

    validateNonEmptyStringField(item, 'title', filePath, label, errors);
    validateNonEmptyStringField(item, 'date', filePath, label, errors);
    validateNonEmptyStringField(item, 'description', filePath, label, errors);

    if (!isNonEmptyString(item.img)) {
      errors.push(`${filePath} item ${label}: "img" must be a non-empty string`);
    } else {
      if (!item.img.startsWith('/terrazzo/assets/events/')) {
        errors.push(`${filePath} item ${label}: "img" must start with /terrazzo/assets/events/`);
      } else {
        validateReferencedAssetExists(item.img, filePath, label, 'img', errors);
      }

      if (!hasExtension(item.img, '.webp')) {
        errors.push(`${filePath} item ${label}: event image must be WebP`);
      }
    }
  });
}

function validateGallery(items, filePath, errors) {
  const seenIds = new Set();

  items.forEach((item, index) => {
    if (!validateObjectItem(item, filePath, index, errors)) {
      return;
    }

    const label = itemLabel(item, index);
    validateRequiredFields(item, filePath, label, ['id', 'src', 'alt'], errors);

    if (!isNonEmptyString(item.id)) {
      errors.push(`${filePath} item ${label}: "id" must be a non-empty string`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${filePath} item ${label}: duplicate id "${item.id}"`);
    } else {
      seenIds.add(item.id);
    }

    if (!isNonEmptyString(item.src)) {
      errors.push(`${filePath} item ${label}: "src" must be a non-empty string`);
    } else {
      if (!item.src.startsWith('/terrazzo/assets/gallery/')) {
        errors.push(`${filePath} item ${label}: "src" must start with /terrazzo/assets/gallery/`);
      } else {
        validateReferencedAssetExists(item.src, filePath, label, 'src', errors);
      }

      if (!hasExtension(item.src, '.webp')) {
        errors.push(`${filePath} item ${label}: gallery image must be WebP`);
      }
    }

    if (!isNonEmptyString(item.alt)) {
      errors.push(`${filePath} item ${label}: "alt" must be a meaningful non-empty string`);
    } else if (isGenericGalleryAlt(item.alt)) {
      errors.push(`${filePath} item ${label}: "alt" is too generic`);
    }
  });
}

function validateObjectItem(item, filePath, index, errors) {
  if (item === null || Array.isArray(item) || typeof item !== 'object') {
    errors.push(`${filePath} item at index ${index}: item must be an object`);
    return false;
  }

  return true;
}

function validateRequiredFields(item, filePath, label, requiredFields, errors) {
  for (const field of requiredFields) {
    if (!Object.hasOwn(item, field)) {
      errors.push(`${filePath} item ${label}: missing required field "${field}"`);
    }
  }
}

function validateNonEmptyStringField(item, field, filePath, label, errors) {
  if (!isNonEmptyString(item[field])) {
    errors.push(`${filePath} item ${label}: "${field}" must be a non-empty string`);
  }
}

function validateReferencedAssetExists(assetPath, filePath, label, field, errors) {
  const repoRelativePath = assetPath.slice(siteBasePath.length);
  const fullPath = path.join(repoRoot, repoRelativePath);

  if (!assetPath.startsWith(siteBasePath) || repoRelativePath.startsWith('..') || path.isAbsolute(repoRelativePath)) {
    errors.push(`${filePath} item ${label}: "${field}" must be a /terrazzo/ repo asset path`);
    return;
  }

  if (!existsSync(fullPath)) {
    errors.push(`${filePath} item ${label}: "${field}" references missing file "${assetPath}"`);
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExtension(filePath, extension) {
  return path.extname(filePath).toLowerCase() === extension;
}

function extensionName(filePath) {
  const extension = path.extname(filePath).replace('.', '').toUpperCase();
  return extension || 'not WebP';
}

function normalizeText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isGenericGalleryAlt(value) {
  const normalizedValue = normalizeText(value);
  return genericGalleryAlts.has(normalizedValue) || numberedGenericGalleryAltPattern.test(normalizedValue);
}

function itemLabel(item, index) {
  if (isNonEmptyString(item?.id)) {
    return `"${item.id}"`;
  }

  return `at index ${index}`;
}

function fail(message) {
  hasErrors = true;
  console.error(`❌ ${message}`);
}

function warn(message) {
  console.log(`⚠️ ${message}`);
}

function printWarnings(warnings) {
  const maxWarnings = 5;

  for (const warning of warnings.slice(0, maxWarnings)) {
    warn(warning);
  }

  if (warnings.length > maxWarnings) {
    warn(`${warnings.length - maxWarnings} more warning${warnings.length - maxWarnings === 1 ? '' : 's'} hidden`);
  }
}
