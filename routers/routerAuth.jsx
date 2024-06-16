import { Router } from "jsr:@oak/oak/router";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { cryptoRandomString } from "https://deno.land/x/crypto_random_string@1.0.0/mod.ts";
import r from "../utils/r.jsx";
import LayoutAuth from "../pages/auth/LayoutAuth.jsx";
import SignInForm from "../pages/auth/SignUpForm.jsx";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import { valid } from "https://deno.land/x/validation@v0.4.0/email.ts";
import { encodeHex } from "jsr:@std/encoding/hex";
import { hash, genSalt } from "https://deno.land/x/bcrypt/mod.ts";

const routerAuth = new Router();

const kv = await Deno.openKv();

routerAuth
  .get("/signup", (context) => {
    context.response.body = render(
      <LayoutAuth>
        <SignInForm />
      </LayoutAuth>,
    );
  })
  .post("/signup", async (context) => {
    const data = await context.request.body.form();

    const email = data.get("email");

    if (!valid(email)) {
      context.response.status = 400;
      context.response.body = "Invalid email";
      return;
    }

    const password = data.get("password");

    const salt = await genSalt();
    const passwordHash = await hash(password, salt);

    const verificationCode = cryptoRandomString({ length: 16, type: "url-safe" });

    await kv.set(["bigshelf_test", "user_auth", email], {
      verified: false,
      verificationCode,
      passwordHash,
      salt
    });

    const theuser = await kv.get(["bigshelf_test", "user_auth", email]);

    console.log(theuser);

    const client = new SMTPClient({
      debug: {
        allowUnsecure: true,
      },
      connection: {
        hostname: "localhost",
        port: 1025,
        tls: false,
        auth: {
          username: "project.1",
          password: "secret.1",
        },
      },
    });

    const emailResponse = {
      from: "bigshelf@bigshelf.deno.dev",
      to: email,
      subject: "Verify your Bigshelf email address  ",
      content: "This is a test email from Deno using smtp.",
    };

    try {
      const res = await client.send(emailResponse);
    } catch (error) {
      context.response.status = 500;
    }

    await client.close();
  });

export default routerAuth;
