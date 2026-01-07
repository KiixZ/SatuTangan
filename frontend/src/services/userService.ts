import api from "./api";

export const userService = {
  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(file: File): Promise<{ profile_photo_url: string }> {
    const formData = new FormData();
    formData.append("profiles", file);

    const response = await api.post("/users/profile/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};
