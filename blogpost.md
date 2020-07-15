# collage-maker

![collage](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/collage.jpg)
Source: https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/collage.jpg

## Background

Creating a collage is always an interesting way to group images. It makes sharing more fun and helps create memories. There are a number of tools out there that does the job very well.

The motivation for this project is to show a method to help create collage using Cloudinary. Personally, it was an effort to learn some advanced implementation techniques like using [variables](https://cloudinary.com/documentation/user_defined_variables), [upload widget](https://cloudinary.com/documentation/upload_widget), [unsigned upload](https://cloudinary.com/documentation/ios_image_and_video_upload#unsigned_upload), [tagging](https://cloudinary.com/documentation/additional_upload_api_options#tagging_assets) and [resource listing](https://cloudinary.com/documentation/advanced_url_delivery_options#client_side_resources).

There are a few [support articles]
(https://support.cloudinary.com/hc/en-us/articles/203411372-How-can-I-create-a-collage-out-of-several-uploaded-images-) and [cookbooks](https://cloudinary.com/cookbook/generate_your_photo_collage_online) on the topic. However, I wanted to show-case an end-to-end work flow through this project.

{note}
Try a live demo: https://collage-creator.netlify.app/
{/note}

To create your own instance of the collage maker, follow these steps:

0. Clone/fork the repository https://github.com/akshay-ranganath/collage-maker.
1. On your account, create an unsigned upload preset
2. Upload and tag a few mages for the collage background.
3. Insert your credentials for the _upload widget_.
4. Create your collage
5. Cleanup

Let's dig into each step.

## Step 1: Create an unsigned upload preset

Head to Cloudinary console -> Settings (gear icon on top right) -> Upload tab. Scroll down and click on _Add Upload Preset_ link.

![upload preset](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/fdhqk0dq1wcv8eby3uwi.png)
Source: https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/fdhqk0dq1wcv8eby3uwi.png

Next, give it a name. I used the name _unsignedCollageUpload_`_. Remember this name as we'll require it to configure the upload widget (_Step 3_). Right below the name, choose the _Signing mode_ to be _Unsigned_.

![naming upload](https://akshayranganath-res.cloudinary.com/image/upload/v1593019933/blog/h7uuxuxjja32rsuzvwfi.png)
Source: https://akshayranganath-res.cloudinary.com/image/upload/v1593019933/blog/h7uuxuxjja32rsuzvwfi.png

Click on the _Media Analysis and AI_ tab and enter the _Tag_ as _collage_. Save the upload present. 

![tagging](https://akshayranganath-res.cloudinary.com/image/upload/v1593019933/blog/vgurqlv9rtpgb2tx9xhj.png)
Source: https://akshayranganath-res.cloudinary.com/image/upload/v1593019933/blog/vgurqlv9rtpgb2tx9xhj.png

You should see the new preset details like this. 

![preset created](https://akshayranganath-res.cloudinary.com/image/upload/v1593020273/blog/zid8geld8yziudiikiws.png)
Source: https://akshayranganath-res.cloudinary.com/image/upload/v1593020273/blog/zid8geld8yziudiikiws.png

Using this preset, we are ensuring that each new file uploaded will a) get a unique file name, b) will not require any signature (so no need to use any special API or SDK for upload) and c) it will be tagged as _collage_.

## Step 2: Select and upload a few background images for collage

The next step is to choose a few background images for the collage. I uploaded these images and tagged them with as _background_. You can validate this by making a [resource list request](https://cloudinary.com/documentation/advanced_url_delivery_options#client_side_resources). We need this call to work as the code can make this single call and identify all the available background images that can be used to create the collage.

```
Sample URL: https://res.cloudinary.com/mermaid/image/list/background.json
```

```json
{
  "resources": [
    {
      "public_id": "background/bokeh-1916807_1280_g6okos",
      "version": 1593039052,
      "format": "jpg",
      "width": 1280,
      "height": 851,
      "type": "upload",
      "created_at": "2020-06-24T22:50:52Z",
      "metadata": [
        {
          "external_id": "mjbcmyjutfk8wgmgdwuz",
          "label": "title",
          "type": "string",
          "value": "default title"
        }
      ]
    },
    ..
  ],
  "updated_at": "2020-06-24T22:55:36Z"
}
```
## Step 3: Customize Upload widget

The next step is to use & configure the [upload widget](https://cloudinary.com/documentation/upload_widget). Follow instructions on the page to include a basic uploader. 

Next, configure the widget so that it can use your Cloudinary cloud name and the unsigned upload preset that was created in step 1. Open `index.html` and insert your cloud name and preset name as below.

```javascript
        /* ------------------ USER SPECIFIC SETUP --------------------------- */
      // Add your cloudname and preset here

      // cloud name
      var cloudName = '<< your cloud name >>'
      // upload preset name
      var preset = '<< your preset name >>'

      /* ------------------ USER SPECIFIC ENDS --------------------------- */
```

At this point, we have a few background images, an upload widget that can upload to Cloudinary and tag the objects as `collage`.

## Step 4: Build the collage maker functionality

Now we get to the core on building the functionality. We will need to do the following:

* Make a call to the list URL and display the available background images.
* Let the user upload 2, 3 or 4 images. If they upload more, we just ignore images after the 4th image.
* Overlay the uploaded images on the background image to create a collage.


### Fetching background images

I am using the tag `background` for identifying background images for the collage. If you'd like to change the tag, you will need to change the `fetch` on the `index.html` to be of the following format: `https://res.cloudinary.com/<cloud-name>/image/list/<tag-name>.json`.

```javascript
fetch('https://res.cloudinary.com/mermaid/image/list/background.json')
  .then(resp => {
    resp.json().then(json => {
      ...
```

### Creating the collage

To create the collage, I am using [image overlays](https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_image_overlays). The basic logic is as follows:

* Identify the background image.
* Using the background image's dimension, relatively size and add the images for the collage.

Re-sizing of the uploaded image is generally done as follows. 
* Set the width of each image to be half of background image width.
* Add a few pixels (I am using 20 pixels) border.
* Calculate the `x` and `y` offset as 1/4th of the background image dimension.
* Use the default (`g_auto:center`) for finding the relative origin and offsetting.

Using the above calculation, create the collage. To generate a link for _download collage_, replace `f_auto` with `fl_attach`. This will make sure that end users download the images as a JPG and not a WebP.

## Cleanup

If at any point, if you'd like to clear all the images that were uploaded for creating the collage, do the following:

* Copy your Cloudinary API credentials from the _Dashboard_ tab.

![copy Cloudinary credentials](https://akshayranganath-res.cloudinary.com/image/upload/f_auto,q_auto/blog/ojisih8bxcxa7fh7rqf7.png)

* Save the credentials as an environmental variable `CLOUDINARY_URL`
* Run the script `deleteResourcesByTagName.js` as:
```
node deleteResourcesByTagName.js
```
This will remove all the images tagged as `collage`. The images used for background will remain safe.

## Next Steps

We can take this forward to detect aspect ratio and then implement clever cropping. We could also expand this to support creating collage with more images if interested.