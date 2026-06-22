import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

const OLD_URL = "https://pub-24c902bc8baf4529be510d6d159c3cc5.r2.dev";
const NEW_URL = "/assets";

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB.");

  // Migrate Properties
  const propertyCollection = mongoose.connection.collection("properties");
  const properties = await propertyCollection.find({}).toArray();
  
  let propertyUpdates = 0;
  for (const prop of properties) {
    let changed = false;
    const updates: any = {};

    if (prop.images && Array.isArray(prop.images)) {
      const newImages = prop.images.map((img: string) => {
        if (img.startsWith(OLD_URL)) {
          changed = true;
          return img.replace(OLD_URL, NEW_URL);
        }
        return img;
      });
      if (changed) updates.images = newImages;
    }

    if (prop.videoTourUrl && prop.videoTourUrl.startsWith(OLD_URL)) {
      updates.videoTourUrl = prop.videoTourUrl.replace(OLD_URL, NEW_URL);
      changed = true;
    }
    
    if (prop.virtualTourUrl && prop.virtualTourUrl.startsWith(OLD_URL)) {
      updates.virtualTourUrl = prop.virtualTourUrl.replace(OLD_URL, NEW_URL);
      changed = true;
    }
    
    if (prop.listerProfile && prop.listerProfile.profilePicture && prop.listerProfile.profilePicture.startsWith(OLD_URL)) {
      updates['listerProfile.profilePicture'] = prop.listerProfile.profilePicture.replace(OLD_URL, NEW_URL);
      changed = true;
    }

    if (changed) {
      await propertyCollection.updateOne({ _id: prop._id }, { $set: updates });
      propertyUpdates++;
    }
  }
  console.log(`Updated ${propertyUpdates} properties.`);

  // Migrate Users
  const userCollection = mongoose.connection.collection("users");
  const users = await userCollection.find({}).toArray();
  
  let userUpdates = 0;
  for (const user of users) {
    if (user.avatarUrl && user.avatarUrl.startsWith(OLD_URL)) {
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { avatarUrl: user.avatarUrl.replace(OLD_URL, NEW_URL) } }
      );
      userUpdates++;
    }
  }
  console.log(`Updated ${userUpdates} users.`);

  // If there are other models (like agents or blogs) we can migrate them here.
  // Using generic search might be slow, but this is tailored to known fields.

  console.log("Migration complete!");
  process.exit(0);
}

main().catch(console.error);
