# NoSQL

## Fuzzing:
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

## Operators:
- $where --> where this is true
- $ne --> not equal to
- $in --> in an array
- $regex --> matches this regex
- Submitting:
  - Need to be nested objects: `{"username": {"$ne","invalid"}}` or as a query `username[$ne]=invalid`
  - Query to test for various admin users: `{"username":{"$in":["admin","administrator","superadmin"]},"password":{"$ne":""}}`

## Extracting data
