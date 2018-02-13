## Abandonware

# Date Tiles Component for Blaze

<img src="https://s32.postimg.org/tfykck0xh/tiles_Date.jpg"/>

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
