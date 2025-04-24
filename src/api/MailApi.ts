import { api } from "./index";

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const mailApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendContactForm: builder.mutation<{ success: boolean }, ContactFormData>({
      query: (contactData) => ({
        url: 'mail/contact',
        method: 'POST',
        body: contactData,
      }),
    }),
  }),
});

export const { useSendContactFormMutation } = mailApi;