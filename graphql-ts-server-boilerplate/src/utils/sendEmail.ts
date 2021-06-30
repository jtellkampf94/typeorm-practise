import * as SparkPost from "sparkpost";
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, url: string) => {
  const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: "",
      subject: "Confirm Email",
      html: `<html>
      <body>
      <a href=${url}>Confirm Email</a>
      </body>
      </html>`
    },
    recipients: [{ address: recipient }]
  });

  console.log(response);
};
