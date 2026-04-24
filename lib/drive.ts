import { google } from "googleapis";
import { Readable } from "stream";

const FOLDER_NAME = "Job Tracker";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

function getDrive() {
  return google.drive({ version: "v3", auth: getAuth() });
}

async function getOrCreateFolder(): Promise<string> {
  const drive = getDrive();
  const search = await drive.files.list({
    q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id)",
  });

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id!;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });
  return folder.data.id!;
}

export async function uploadFileToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const drive = getDrive();
  const folderId = await getOrCreateFolder();

  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id,webViewLink",
  });

  await drive.permissions.create({
    fileId: file.data.id!,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return file.data.webViewLink!;
}
