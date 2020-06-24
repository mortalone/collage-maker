# collage-maker

![collage](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/collage.jpg)

## Background

Creating a collage is always an interesting way to group images. It is makes sharing more fun and helps create memories. There are a number of tools out there that does the job very well.

The motivation for this project is to show a method to help create collage using Cloudinary. Personally, it was an effort to learn some advanced implementation techniques like using [variables](https://cloudinary.com/documentation/user_defined_variables), [upload widget](https://cloudinary.com/documentation/upload_widget), [unsigned upload](https://cloudinary.com/documentation/ios_image_and_video_upload#unsigned_upload), [tagging](https://cloudinary.com/documentation/additional_upload_api_options#tagging_assets) and [resource listing](https://cloudinary.com/documentation/advanced_url_delivery_options#client_side_resources).

There are a few [support articles]
(https://support.cloudinary.com/hc/en-us/articles/203411372-How-can-I-create-a-collage-out-of-several-uploaded-images-) and [cookbooks](https://cloudinary.com/cookbook/generate_your_photo_collage_online) on the topic. However, I wanted to show-case an end-to-end work flow through this project.

Here's how you can use the code.

## Step 1: Create an unsigned upload preset

Head to Cloudinary console -> Settings (gear icon on top right) -> Upload tab. Scroll down and click on _Add Upload Preset_ link.

![upload preset](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/fdhqk0dq1wcv8eby3uwi.png)

Next, give it a name. I used the name _unsignedCollageUpload_`_. Remember this name as we'll require it to configure the upload widget. Right below the name, choose the _Signing mode_ to be _Unsigned_.

![naming upload](https://akshayranganath-res.cloudinary.com/image/upload/v1593019933/blog/h7uuxuxjja32rsuzvwfi.png)

Click on the _Media Analysis and AI_ tab and enter the _Tag_ as _collage_. Save the upload present. 

![tagging](https://akshayranganath-res.cloudinary.com/image/upload/v1593019933/blog/vgurqlv9rtpgb2tx9xhj.png)

You should see the new preset details. 

![preset created](https://akshayranganath-res.cloudinary.com/image/upload/v1593020273/blog/zid8geld8yziudiikiws.png)

It says each new file will uploaded using this preset will get a unique file name, will not require any signature (so no need to use any special API or SDK for upload) and all images will be tagged as _collage_.

## Step 2: Select and upload a few background images for collage

The next step is to choose a few background images for the collage. I uploaded these images and tagged them with as _background_. You can validate this by making a [resource list request](https://cloudinary.com/documentation/advanced_url_delivery_options#client_side_resources). We need this call to work as the code can make this single call and identify all the available background images that can be used to create the collage.

```
Sample URL: https://akshayranganath-res.cloudinary.com/image/list/background.json
```

```json
{
  "resources": [
    {
      "public_id": "background/tswrgyw4r8abidwbpcz9",
      "version": 1591818611,
      "format": "jpg",
      "width": 1280,
      "height": 930,
      "type": "upload",
      "created_at": "2020-06-10T19:50:11Z"
    },
    {
      "public_id": "background/oojobk4jlwfigvhg77mt",
      "version": 1591818611,
      "format": "jpg",
      "width": 1280,
      "height": 832,
      "type": "upload",
      "created_at": "2020-06-10T19:50:11Z"
    },
    {
      "public_id": "background/cfa6onnze6q4xdsbc1lm",
      "version": 1591818611,
      "format": "jpg",
      "width": 1280,
      "height": 908,
      "type": "upload",
      "created_at": "2020-06-10T19:50:11Z"
    },
    {
      "public_id": "background/u8vb0yjrvgekrgezj3fe",
      "version": 1591818610,
      "format": "jpg",
      "width": 1280,
      "height": 853,
      "type": "upload",
      "created_at": "2020-06-10T19:50:10Z"
    }
  ],
  "updated_at": "2020-06-22T22:14:18Z"
}
```
## Step 3: Customize Upload widget

The next step is to use & configure the [upload widget](https://cloudinary.com/documentation/upload_widget). Follow instructions on the page to include a basic uploader. Configure the widget so that it can use your Cloudinary cloud name and the unsigned upload preset that was created in step 1.

```javascript
  var myWidget = cloudinary.createUploadWidget({
      cloudName: "<< your cloud name >>",
      uploadPreset: "<< your unsigned upload preset name >>"
    },
```

At this point, we have a few background images, an upload widget that can upload to Cloudinary and tag the objects as `collage`.

## Step 4: Build the collage maker functionality

Now we get to the core on building the functionality. We will need to do the following:

* Make a call to the list URL and display the available background images.
* Let the user upload 2, 3 or 4 images. If they upload more, we just ignore images after the 4th image.
* Using the background image and the uploaded images, create a collage.


### Fetching background images

I am using the tag `background` for identifying background images for the collage. If you'd like to change the tag, you will need to change the `fetch` on the `index.html` to be of the following format: `https://res.cloudinary.com/<cloud-name>/image/list/<tag-name>.json`.

```javascript
fetch('https://res.cloudinary.com/demo/image/list/background.json')
  .then(resp => {
    resp.json().then(json => {
      ...
```

### Creating the collage

To create the collage, I am using [image overlays](https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_image_overlays). The basic logic is as follows:

* Identify the background image.
* Using the background image's dimension, relatively size and add the images for the collage.

Re-sizing of the uploaded image is generally done as follows. 
* Set the width of each image to be half of original background image width.
* Add a few pixels (I am using 20 pixels) border.
* Calculate the `x` and `y` offset as 1/4th of the dimension.
* Use the default (`g_auto:center`) for finding the relative origin and offsetting.

Using the above calculation, create the collage. For generating the download line, replace `f_auto` with `fl_attach`. This will make sure that end users download the images as a JPG and not a WebP.

## Next Steps

We can take this forward to detect aspect ratio and then implement clever cropping. We could also expand this to support creating collage with more images if interested.
