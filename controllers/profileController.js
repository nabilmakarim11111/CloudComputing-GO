const { db, bucket } = require('../db/firestore');
const { v4: uuidv4 } = require('uuid');

const getProfileDetails = async (req, res) => {
    const { email } = req.user;

    try {
        const userRef = db.collection('users').doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(400).json({
                status: "fail",
                message: "Failed to Get Profile"
            });
        }

        const userData = userDoc.data();
        // Exclude the password from the response
        const { password, updatedAt, createdAt, token, ...userWithoutSensitiveInfo } = userData;

        return res.status(201).json({
            status: "successful",
            message: "User get profile success",
            userId: userData.userId,
            data: userWithoutSensitiveInfo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};

const updateProfileDetails = async (req, res) => {
    const { email } = req.user;
    const updatedData = req.body.data;

    try {
        const userRef = db.collection('users').doc(email);
        await userRef.update(Object.assign(updatedData, { updatedAt: new Date() }));

        const userDoc = await userRef.get();
        const userData = userDoc.data();

        return res.status(201).json({
            status: "successful",
            message: "User update profile success",
            userId: userData.userId,
            data: userData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};

const uploadProfileImage = async (req, res) => {
    const { email } = req.user;
    const { file } = req; // Assuming you're using multer to handle file uploads

    try {
        const userRef = db.collection('users').doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(400).json({
                status: "fail",
                message: "User not found"
            });
        }

        const blob = bucket.file(`profileImages/${email}_${file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            await userRef.update({ gambar_profil: publicUrl, updatedAt: new Date() });

            res.status(201).json({
                status: 'successful',
                message: 'Profile image uploaded successfully',
                imageUrl: publicUrl
            });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getProfileDetails,
    updateProfileDetails,
    uploadProfileImage
};
