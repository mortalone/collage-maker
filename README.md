# collage-maker

To use the code, we need a few setup. 

* Create an unsigned upload preset such that it can tag the uploaded images.
* Edit `index.html` and enter the following to configure the `upload widget`
 * `cloudName`: This should be your cloud name.
 * `uploadPreset`: This should be the unsigned upload preset you created in the previous step. (See below)
* Upload a set of images and tag them as _background_.

```javascript
  var myWidget = cloudinary.createUploadWidget({
      cloudName: "<< your cloud name >>",
      uploadPreset: "<< your unsigned upload preset name >>"
    },
```

That's it. You should be set and able to work with the code.

For details, please refer to [_tutorial.md_](https://github.com/akshay-ranganath/collage-maker/blob/master/tutorial.md).