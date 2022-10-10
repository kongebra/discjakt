// import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
// import { v4 as uuidv4 } from "uuid";

// const containerName = "uploads";
// const sasToken = process.env.NEXT_PUBLIC_STORAGESASTOKEN;
// const storageAccountName = process.env.NEXT_PUBLIC_STORAGERESOURCENAME;

// export const uploadFile = async (file: File | null) => {
//   if (!file) {
//     return "";
//   }

//   const blobService = new BlobServiceClient(
//     `https://${storageAccountName}.blob.core.windows.net/${sasToken}`
//   );

//   const containerClient: ContainerClient =
//     blobService.getContainerClient(containerName);

//   const ext = file.name.split(".").pop();
//   const fileName = `${uuidv4()}.${ext}`;

//   const blobClient = containerClient.getBlockBlobClient(fileName);
//   const options = { blobHTTPHeaders: { blobContentType: file.type } };

//   await blobClient.uploadData(file, options);

//   return `https://${storageAccountName}.blob.core.windows.net/uploads/${fileName}`;
// };
const storage: any = {};
export default storage;
