/*
 * displayUploadedImage - Helper function that takes the public Id of an image, creates an <img> tag and loads a thumnail crop.
*/
function displayUploadedImage (publicId) {
  var img = new Image()
  img.src = 'https://res.cloudinary.com/' + window.cloudName + '/image/upload/c_thumb,w_350,h_350,f_auto,q_auto/' + publicId
  var imageDiv = document.getElementById('images')
  imageDiv.append(img)
}

/*
 * findSelectedBackground - Load all the images that are tagged with `background`
 * Attach a click even so that we can detect the background selected by user.
 * Reset selection as well so that we don't confuse users on their chosen background.
*/
function findSelectedBackground () {
  fetch('https://res.cloudinary.com/' + window.cloudName + '/image/list/background.json')
    .then(resp => {
      resp.json().then(json => {
        var objects = json.resources
        for (var i = 0; i < objects.length; i++) {
          var url = 'https://res.cloudinary.com/' + window.cloudName + '/c_thumb,w_250,h_250,f_auto,q_auto/' + objects[i].public_id
          var img = new Image()
          img.src = url
          img.alt = objects[i].public_id
          img.addEventListener('click', function () {
            // first cleanup the background for all images
            var bgpics = document.getElementById('bgpics').childNodes
            for (var i = 0; i < bgpics.length; i++) {
              bgpics[i].style = ''
            }
            this.style = 'border: 5px solid yellow'
            // set the global variable tracking the background image
            window.selectedBackground = this.alt
          }, false)
          document.getElementById('bgpics').append(img)
        }
      }).catch(e => {
        console.log(e)
      })
    }).catch(e => {
      console.log(e)
    })
}

/*
  generateCollage generates the picture collage using the array of uploaded `images` and by overlaying them on the `background` image.
*/
function generateCollage (images, background) {
  var totalImages = images.length
  var url = 'https://res.cloudinary.com/' + window.cloudName + '/image/upload/'

  if (totalImages === 2) {
    url += '$h_ih_sub_20,$w_iw_div_2_sub_20,$x_iw_div_4,$x1_iw_div_4_mul_-1,$nw_iw,$nh_ih_div_2,$t_ih_div_4/c_scale,w_$nw,h_$nh' +
              '/l_' + images[0] +
              ',w_$w,h_$h,c_pad,x_$x,e_unsharp_mask' +
              '/l_' + images[1] +
              ',w_$w,h_$h,c_pad,x_$x1,e_unsharp_mask/'
  } else if (totalImages === 3) {
    url += '$ox_iw_div_4,$ox1_iw_div_4_mul_-1,$oy_ih_div_4,$oy1_ih_div_4_mul_-1,$w_iw_div_2_sub_20,$w1_iw_sub_20,$h_ih_div_2_sub_20,$t_ih_div_4/' +
        'l_' + images[0] +
        ',x_$ox,y_$oy1,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[1] +
        ',x_$ox1,y_$oy1,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[2] +
        ',y_$oy,w_$w,h_$h,c_pad,e_unsharp_mask/'
  } else { // if (totalImages === 4)
    url += '$ox_iw_div_4,$ox1_iw_div_4_mul_-1,$oy_ih_div_4,$oy1_ih_div_4_mul_-1,$w_iw_div_2_sub_20,$h_ih_div_2_sub_20,$t_ih_div_4/' +
        'l_' + images[0] +
        ',x_$ox,y_$oy1,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[1] +
        ',x_$ox1,y_$oy1,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[2] +
        ',x_$ox,y_$oy,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[3] +
        ',x_$ox1,y_$oy,w_$w,h_$h,c_pad,e_unsharp_mask/'
  }

  if (document.getElementById('message').value) {
    url += '/l_text:Sacramento_35_bold:' + encodeURI(document.getElementById('message').value) + ',y_$t,co_rgb:990C47,g_north/'
  }
  url += 'f_auto,q_auto/' + background

  var img = new Image()
  img.src = url
  var collage = document.getElementById('finalCollage')
  collage.append(img)

  // add a get the collage link
  var ahref = document.createElement('a')
  ahref.href = url.replace('f_auto', 'fl_attachment')
  ahref.target = '_blank'
  ahref.text = 'Download the image'
  collage.append(ahref)
}
