$('.ui.form')
    .form({
        fields: {
            "campground[title]": 'empty',
            "campground[location]": 'empty',
            "campground[image]": 'empty',
            "campground[price]": {
                identifier  : 'campground[price]',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Price must have a value'
                },
                {
                    type: 'number',
                    prompt: 'Please enter a valid number'
                }
                ]
            },
            "campground[description]": 'empty'
        }
    });