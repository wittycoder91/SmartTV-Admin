const fs = require('fs')

// Create necessary directories
const directories = [
  'public/uploads',
  'public/uploads/menu',
  'public/uploads/lunch',
  'public/uploads/coffee',
  'public/uploads/wine',
  'public/uploads/background',
]

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

console.log('Setup completed successfully!')
console.log('Run "npm install" to install dependencies')
console.log('Run "npm run dev" to start both frontend and backend servers')
