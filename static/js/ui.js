$('.ui.form.campground')
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


$('.ui.form.review')
    .form({
        fields: {
            "review[rating]": 'empty',
            "review[body]": 'empty',
        }
    });

$('.ui.form.register')
    .form({
        fields: {
            "user[email]": {
                identifier  : 'user[email]',
                rules: [
                {
                    type   : 'email',
                    prompt : 'Please enter a valid e-mail'
                },
                {
                    type   : 'empty',
                    prompt : 'E-mail must have a value'
                },
                ]
            },
            "user[username]": {
                identifier  : 'user[username]',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Username must have a value'
                },
                ]
            },
            "user[password]": {
                identifier: 'user[password]',
                rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a password'
                },
                {
                    type   : 'minLength[1]',
                    prompt : 'Your password must be at least {ruleValue} characters'
                }
                ]
            }
        }
    });

// in case we want to use fomantic's message instead of toast.
// $('.message .close')
//   .on('click', function() {
//     $(this)
//       .closest('.message')
//       .transition('fade')
//     ;
//   });