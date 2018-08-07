<h1 align="center">
    <a href="https://github.com/vazco">vazco</a>/Date Tiles Component for Blaze
</h1>

&nbsp;

<h3 align="center">
  -- Abandonware. This package is deprecated! --
</h3>

&nbsp;

### Using as standalone

```html
<template name="myFile">
     {{> universeDateTiles selectedDate=getDate currentDate=getDate}}
</template>
```

`getDate` is your helper that returns date object

This template triggers a `change` event any time new date was selected
(you can block changing of value by calling `preventDefault()` for event)
there is also `navigateToDate` event.

example:
```js
Template.yourTemplate.events({
    change (event, template, newDate) {
        console.log(newDate);
    }
});
````

## Using with AutoForms

### as a QuickField

```html
{{> afQuickField name='myDate' type='universeDateTiles'}}
```

### in Schema:
```
//Add this part to field in schema
autoform: {
     type: 'universeDateTiles',
}
```

### License

<img src="https://vazco.eu/banner.png" align="right">

**Like every package maintained by [Vazco](https://vazco.eu/), Date Tiles Component for Blaze is [MIT licensed](https://github.com/vazco/uniforms/blob/master/LICENSE).**
