#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to configure Prisma schema for CI environment
 * Switches from SQLite (development) to PostgreSQL (CI)
 */

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const backupPath = path.join(__dirname, '../prisma/schema.prisma.backup');

function setupCIDatabase() {
  try {
    // Read the current schema
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Create backup of original schema
    fs.writeFileSync(backupPath, schema);
    console.log('✓ Created backup of original schema');
    
    // Transform schema for CI environment
    const ciSchema = schema
      // Change provider from sqlite to postgresql
      .replace(/provider = "sqlite"/, 'provider = "postgresql"')
      // Change database URL from file to environment variable
      .replace(/url\s*=\s*"file:\.\/dev\.db"/, 'url = env("DATABASE_URL")')
      // Convert String JSON fields to Json type for PostgreSQL
      .replace(/children\s+String\s+@default\("\[\]"\)\s*\/\/ JSON as String for SQLite/g, 'children Json @default("[]") // JSON type for PostgreSQL')
      .replace(/mood_tags\s+String\s+@default\("\[\]"\)\s*\/\/ JSON as String for SQLite/g, 'mood_tags Json @default("[]") // JSON type for PostgreSQL')
      .replace(/ai_reasoning\s+String\?\s*\/\/ JSON as String for SQLite/g, 'ai_reasoning Json? // JSON type for PostgreSQL')
      .replace(/completion_data\s+String\?\s*\/\/ JSON as String for SQLite/g, 'completion_data Json? // JSON type for PostgreSQL')
      .replace(/preferences\s+String\s+@default\("\[\]"\)\s*\/\/ JSON as String for SQLite/g, 'preferences Json @default("[]") // JSON type for PostgreSQL')
      .replace(/tags\s+String\s+@default\("\[\]"\)\s*\/\/ JSON as String for SQLite/g, 'tags Json @default("[]") // JSON type for PostgreSQL')
      .replace(/partners\s+String\s+@default\("\[\]"\)\s*\/\/ JSON as String for SQLite/g, 'partners Json @default("[]") // JSON type for PostgreSQL')
      // Handle any remaining String fields that should be Json
      .replace(/(\w+)\s+String\s+@default\("\[\]"\)/g, '$1 Json @default("[]")')
      .replace(/(\w+)\s+String\?\s*\/\/ JSON as String/g, '$1 Json? // JSON type');
    
    // Write the CI-compatible schema
    fs.writeFileSync(schemaPath, ciSchema);
    console.log('✓ Updated schema for CI environment (PostgreSQL)');
    
    // Log changes made
    console.log('📋 Changes applied:');
    console.log('  • Provider: sqlite → postgresql');
    console.log('  • URL: file:./dev.db → env("DATABASE_URL")');
    console.log('  • JSON fields: String → Json type');
    
  } catch (error) {
    console.error('❌ Error setting up CI database:', error.message);
    process.exit(1);
  }
}

function restoreOriginalSchema() {
  try {
    if (fs.existsSync(backupPath)) {
      const originalSchema = fs.readFileSync(backupPath, 'utf8');
      fs.writeFileSync(schemaPath, originalSchema);
      fs.unlinkSync(backupPath);
      console.log('✓ Restored original schema');
    } else {
      console.log('⚠️  No backup found to restore');
    }
  } catch (error) {
    console.error('❌ Error restoring schema:', error.message);
    process.exit(1);
  }
}

// Check command line arguments
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupCIDatabase();
    break;
  case 'restore':
    restoreOriginalSchema();
    break;
  default:
    console.log('Usage:');
    console.log('  node scripts/setup-ci-db.js setup   - Configure schema for CI');
    console.log('  node scripts/setup-ci-db.js restore - Restore original schema');
    process.exit(1);
}