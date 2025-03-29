This is a overengineered script to delete emails from a gmail account. It uses child processes to batch delete emails in parallel. I just wanted to use child processes for the sake of it. 

You just need to generate an authentication token to gmail api v1 on google oAuth2.0 playground and paste it in the api.mjs file, right on the const authToken then add you email addres in the const userId and run the file index.mjs.
