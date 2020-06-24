/*
* A simple script to delete all the resources by tag.
* For this project, all the user uploaded images are tagged as `collage`.
* So this script will delete all images tagged with `collage`.
* Script assumes the API credentials are part of your environment variable CLOUDINARY_URL.
*/

var cloudinary = require('cloudinary')

cloudinary.v2.api.delete_resources_by_tag('collage').then(resp => {
  console.log('Delete successful')
}).catch(err => {
  console.log(err)
})
