import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
  },
  build: {
    // ===== ADVANCED OBFUSCATION & MINIFICATION =====
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console statements that might leak information
        drop_console: true,
        drop_debugger: true,
        
        // Reduce compression passes for less aggressive minification
        passes: 2,
        
        // Dead code elimination
        dead_code: true,
        
        // Reduce inline threshold
        inline: 1,
        
        // Less aggressive variable compression
        reduce_vars: false,
        reduce_funcs: false,
        
        // Keep function names during compression
        keep_fnames: true,
      },
      
      mangle: {
        // Don't mangle top-level variables - breaks Electron/React connections
        toplevel: false,

        // Keep function names readable - essential for React hooks and IPC calls
        keep_fnames: true,
      },
      
      format: {
        // No comments in output
        comments: false,
        
        // Beautify set to false for maximum obfuscation
        beautify: false,
        
        // Maximum compression
        quote_keys: false,
      },
      
      // Obfuscate string literals
      ecma: 2020,
    },
    
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        // Format must be 'es' for Electron renderer - 'cjs' causes 'exports is not defined' error
        format: 'es',
        // Compact output format
        compact: true,
        // No source maps in production
        sourcemap: false,
        // Mangle all variable names
        manualChunks: {
          'vendor': ['react', 'react-dom', 'lucide-react', 'crypto-js'],
        },
      },
    },
    
    // ===== SECURITY SETTINGS =====
    // Disable source maps for production builds to prevent code reverse-engineering
    sourcemap: false,
    
    // Report file sizes to ensure good compression
    reportCompressedSize: true,
    
    // Output directory
    outDir: 'dist',
    
    // Chunk size warning limit (increase for larger apps)
    chunkSizeWarningLimit: 800,
    
    // CSS code splitting
    cssCodeSplit: true,
  },
})

