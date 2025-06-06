export const invalidLoginData = [
    {
        email: '',
        expectedEmailErrorMessage: 'This field can not be empty',
        passwords: '',
        expectedPasswordErrorMessage: 'This field can not be empty'
    },
    {
        email: 'abc',
        expectedEmailErrorMessage: 'Invalid email',
        passwords: '',
        expectedPasswordErrorMessage: 'This field can not be empty'
    }
]