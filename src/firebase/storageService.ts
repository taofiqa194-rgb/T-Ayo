import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseInitialized } from './config';

export const FirebaseStorageService = {
  /**
   * Upload a student passport photo to Firebase Storage
   * Path: students/{studentNumber}/passport_{timestamp}
   */
  async uploadStudentPassport(studentNumber: string, fileOrDataUrl: File | Blob | string): Promise<string> {
    const cleanId = studentNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `students/${cleanId}/passport_${Date.now()}`;
    return this.uploadFile(path, fileOrDataUrl, 'image/jpeg');
  },

  /**
   * Upload a staff member passport photo to Firebase Storage
   * Path: staff/{staffId}/passport_{timestamp}
   */
  async uploadStaffPassport(staffId: string, fileOrDataUrl: File | Blob | string): Promise<string> {
    const cleanId = staffId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `staff/${cleanId}/passport_${Date.now()}`;
    return this.uploadFile(path, fileOrDataUrl, 'image/jpeg');
  },

  /**
   * Upload an administrator passport photo to Firebase Storage
   * Path: administrators/{adminId}/passport_{timestamp}
   */
  async uploadAdminPassport(adminId: string, fileOrDataUrl: File | Blob | string): Promise<string> {
    const cleanId = adminId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `administrators/${cleanId}/passport_${Date.now()}`;
    return this.uploadFile(path, fileOrDataUrl, 'image/jpeg');
  },

  /**
   * Upload admission documents (birth certificate, report card, passport) to Firebase Storage
   * Path: admission_documents/{applicationNumber}/{docName}_{timestamp}
   */
  async uploadAdmissionDocument(applicationNumber: string, docName: string, fileOrDataUrl: File | Blob | string): Promise<string> {
    const cleanApp = applicationNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanDoc = docName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `admission_documents/${cleanApp}/${cleanDoc}_${Date.now()}`;
    return this.uploadFile(path, fileOrDataUrl);
  },

  /**
   * Generic file uploader to Firebase Storage with intelligent fallback
   */
  async uploadFile(path: string, fileOrDataUrl: File | Blob | string, defaultContentType = 'application/octet-stream'): Promise<string> {
    if (!isFirebaseInitialized || !storage) {
      if (typeof fileOrDataUrl === 'string') return fileOrDataUrl;
      return URL.createObjectURL(fileOrDataUrl);
    }

    try {
      const storageRef = ref(storage, path);

      if (typeof fileOrDataUrl === 'string') {
        if (fileOrDataUrl.startsWith('data:')) {
          await uploadString(storageRef, fileOrDataUrl, 'data_url');
          return await getDownloadURL(storageRef);
        }
        // Already a remote URL (e.g. Unsplash or existing storage URL)
        return fileOrDataUrl;
      }

      await uploadBytes(storageRef, fileOrDataUrl, {
        contentType: fileOrDataUrl.type || defaultContentType
      });

      return await getDownloadURL(storageRef);
    } catch (error) {
      console.warn(`Firebase Storage upload to ${path} encountered issue, using fallback preview:`, error);
      if (typeof fileOrDataUrl === 'string') {
        return fileOrDataUrl;
      }
      return URL.createObjectURL(fileOrDataUrl);
    }
  }
};
