# collage-maker

To use the code, we need a few setup. 

* Create an unsigned upload preset such that it can tag the uploaded images.
* Edit `index.html` and enter the following to configure the `upload widget`
 * `cloudName`: This should be your cloud name.
 * `uploadPreset`: This should be the unsigned upload preset you created in the previous step. (See below)
* Upload a set of images and tag them as _background_. If you'd like to change this tag name, see tutorial.md.

```javascript
        /* ------------------ USER SPECIFIC SETUP --------------------------- */
      // Add your cloudname and preset here

      // cloud name
      var cloudName = '<< your cloud name >>'
      // upload preset name
      var preset = '<< your preset name >>'

      /* ------------------ USER SPECIFIC ENDS --------------------------- */
```

That's it. You should be set and able to work with the code.

For details, please refer to [_tutorial.md_](https://github.com/akshay-ranganath/collage-maker/blob/master/tutorial.md).