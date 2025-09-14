// Aqui verifica se um perfil pertence mesmo a uma determinada conta
import { ObjectId } from "mongodb";
import connectToDatabase from "./connectDb";

export async function validateProfile(
  userId: string, 
  profileId: string
): Promise<boolean> {
  try {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(profileId)) {
      return false;
    }

    const { db } = await connectToDatabase();
    const profilesCollection = db.collection("Profiles");

    const profile = await profilesCollection.findOne({
      _id: new ObjectId(profileId),
      accountId: new ObjectId(userId)
    });

    return !!profile;
    
  } catch {
    return false;
  }
}