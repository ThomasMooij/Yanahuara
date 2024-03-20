import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v1 as uuidv1 } from 'uuid';

// Initialize the S3 client
const s3 = new S3Client({
    region: "sa-east-1",
    credentials: {
        accessKeyId: "yourAccessKeyId",
        secretAccessKey: "yourSecretAccessKey",
    }
});

export const getImage = async (req, res) => {
    try {
        // Generate a unique foler/file key with UUID where the 
        //userid is used as foldername and id as file name inside of aws
        const key = `${req.userId}/${uuidv1()}.jpeg`;

        // Create a new instance of the PutObjectCommand with your bucket and the key
        // this is a required param to create the url required for upload
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
        const command = new PutObjectCommand({
            Bucket: 'NON-EXISTANT-BUCKET123',
            Key: key,
            ContentType: 'image/jpeg', // Corrected ContentType
        });

        // Generate the signed URL 
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-s3-request-presigner/
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        // Send off key and url for frontend
        // https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html
        // https://blixtdev.com/direct-s3-uploads-from-web-or-mobile/
        res.status(200).json({ key, url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error generating signed URL" });
    }
};
