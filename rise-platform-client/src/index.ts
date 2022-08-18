import axios from "axios";

export class RiseClient {
  private app_id: string;
  private app_secret: string;

  constructor({ app_id, app_secret }: { app_id: string; app_secret: string }) {
    this.app_id = app_id;
    this.app_secret = app_secret;
  }

  async connect({
    callback_url,
    scopes,
  }: {
    callback_url: string;
    scopes: string[];
  }) {
    const { data } = await axios.post(
      "http://localhost:5000/account/apps/connect",
      {
        app_id: this.app_id,
        app_secret: this.app_secret,
        callback_url,
        scopes,
      }
    );
    const connect_url: string = data.connect_url;

    return { connect_url };
  }
}
