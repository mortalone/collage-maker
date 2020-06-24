function listImages (image) {
  var img = new Image()
  img.src = 'https://res.cloudinary.com/akshayranganath/image/upload/c_thumb,w_350,h_350,f_auto,q_auto/' + image
  var imageDiv = document.getElementById('images')
  imageDiv.append(img)
}

function generateCollage (images, background) {
  var totalImages = images.length
  var url
  // if 2 images are selected
  if (totalImages === 2) {
    // https://res.cloudinary.com/akshayranganath/image/upload/
    // $nw_iw_div_2_sub_20,$no_iw_div_4,$no1_iw_div_4_mul_-1,$nh_ih_div_2_add_200/c_crop,h_$nh,ar_4/
    // l_wequ71sxouikpv2ebnbe,c_pad,w_$nw,h_$nh,x_$no1/
    // l_zgs1xnhlowcayhynagf3,c_pad,w_$nw,h_$nh,x_$no/
    // background/oojobk4jlwfigvhg77mt
    url = 'https://res.cloudinary.com/akshayranganath/image/upload/$h_ih_sub_20,$w_iw_div_2_sub_20,$x_iw_div_4,$x1_iw_div_4_mul_-1,$nw_iw,$nh_ih_div_2,$t_ih_div_4/c_scale,w_$nw,h_$nh' +
              '/l_' + images[0] +
              ',w_$w,h_$h,c_pad,x_$x,e_unsharp_mask' +
              '/l_' + images[1] +
              ',w_$w,h_$h,c_pad,x_$x1,e_unsharp_mask/'
  } else if (totalImages === 3) {
    url = 'https://res.cloudinary.com/akshayranganath/image/upload/$ox_iw_div_4,$ox1_iw_div_4_mul_-1,$oy_ih_div_4,$oy1_ih_div_4_mul_-1,$w_iw_div_2_sub_20,$w1_iw_sub_20,$h_ih_div_2_sub_20,$t_ih_div_4/' +
        'l_' + images[0] +
        ',x_$ox,y_$oy1,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[1] +
        ',x_$ox1,y_$oy1,w_$w,h_$h,c_pad,e_unsharp_mask/' +
        'l_' + images[2] +
        ',y_$oy,w_$w,h_$h,c_pad,e_unsharp_mask/'
  } else if (totalImages === 4) {
    url = 'https://res.cloudinary.com/akshayranganath/image/upload/$ox_iw_div_4,$ox1_iw_div_4_mul_-1,$oy_ih_div_4,$oy1_ih_div_4_mul_-1,$w_iw_div_2_sub_20,$h_ih_div_2_sub_20,$t_ih_div_4/' +
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
    url += 'l_text:Parisienne_35_bold:' + encodeURI(document.getElementById('message').value) + ',y_$t,co_rgb:990C47,g_north/'
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

function loadBackgroundImages () {
  // first make a call to pull down all images tagged with 'background' and display them
  resp = fetch('https://akshayranganath-res.cloudinary.com/image/list/background.json')
  console.log(resp.json())
}
