/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const clientRoot = path.resolve(__dirname, 'client')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(clientRoot, 'src'),
      // Ensure all deps resolve from client/node_modules
      react: path.resolve(clientRoot, 'node_modules/react'),
      'react-dom': path.resolve(clientRoot, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(clientRoot, 'node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': path.resolve(clientRoot, 'node_modules/react/jsx-dev-runtime'),
      'wouter/memory-location': path.resolve(clientRoot, 'node_modules/wouter/src/memory-location.js'),
      wouter: path.resolve(clientRoot, 'node_modules/wouter/src/index.js'),
      '@tanstack/react-query': path.resolve(clientRoot, 'node_modules/@tanstack/react-query'),
      '@testing-library/react': path.resolve(clientRoot, 'node_modules/@testing-library/react'),
      '@testing-library/jest-dom': path.resolve(clientRoot, 'node_modules/@testing-library/jest-dom'),
      '@testing-library/user-event': path.resolve(clientRoot, 'node_modules/@testing-library/user-event'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(clientRoot, 'src/test-setup.ts')],
    include: ['tests/client/**/*.test.{ts,tsx}'],
    deps: {
      moduleDirectories: ['node_modules', path.resolve(clientRoot, 'node_modules')],
    },
  },
})
