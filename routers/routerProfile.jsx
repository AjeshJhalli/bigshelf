import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';
import { Router } from 'jsr:@oak/oak/router';
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import ProfileTabs from '../templates/person/ProfileTabs.jsx';
import ProfileRelatedDataTabs from '../templates/person/ProfileRelatedDataTabs.jsx';

const env = await load();
const databaseUrl = env["DATABASE_URL"];
const pool = new Pool(databaseUrl, 3, true);
const connection = await pool.connect();

const routerProfile = new Router();

routerProfile
  .get('/', async (context) => {

    const personId = parseInt(context.params.personId);
    const profileId = parseInt(context.params.profileId);

    const profilesResponse = await connection.queryArray(`
      SELECT
        z_pk_profile,
        z_fk_email_address_array,
        profile_name,
        profile_ff5
      FROM
        profile
      WHERE
        z_fk_person = $personId
      `,
      { personId }
    );

    const emailAddressesResponse =  await connection.queryArray(`
      SELECT
        z_pk_email_address,
        email_address_value
      FROM
        email_address
      WHERE
        z_fk_person = $personId
      `,
      { personId }
    );

    const profiles = profilesResponse
      .rows
      .map(([id, linkedEmailAddresses, name, ff5 ]) => ({ id, linkedEmailAddresses, name, ff5 }));

    const selectedProfile = profiles.find(profile => profile.id == profileId);

    const emailAddresses = emailAddressesResponse
      .rows
      .map(([ id, value ]) => ({ id, value }))
      .filter(({ id }) => selectedProfile.linkedEmailAddresses.includes(id));

    context.response.body = render(
      <ProfileTabs
        profiles={profiles}
        selectedProfile={selectedProfile}
        personId={personId}
        items={emailAddresses}
      />
    );

  })
  .get('/:relatedDataTab', async (context) => {

    const personId = parseInt(context.params.personId);
    const profileId = parseInt(context.params.profileId);
    const relatedDataTab = context.params.relatedDataTab;

    const profileResponse = await connection.queryArray(`
      SELECT
        z_fk_email_address_array,
        z_fk_phone_number_array
      FROM
        profile
      WHERE
        z_pk_profile = $profileId
      `,
      { profileId }
    );

    const profile = profileResponse.rows[0];

    switch (relatedDataTab) {
      case 'email-addresses': {

        const emailAddressesResponse = await connection.queryArray(`
          SELECT
            z_pk_email_address,
            email_address_value
          FROM
            email_address
          WHERE
            z_fk_person = $personId
          `,
          { personId }
        );

        const emailAddresses = emailAddressesResponse
          .rows
          .map(([ id, value ]) => ({ id, value }))
          .filter(({ id }) => profile[0].includes(id));

        context.response.body = render(<ProfileRelatedDataTabs profileId={profileId} personId={personId} selectedTab='Email Addresses' className='col-span-2' items={emailAddresses} />);
        break;
      }

      case 'phone-numbers': {

        const phoneNumbersResponse = await connection.queryArray(`
          SELECT
            z_pk_phone_number,
            phone_number_value
          FROM
            phone_number
          WHERE
            z_fk_person = $personId
          `,
          { personId }
        );

        const phoneNumbers = phoneNumbersResponse
          .rows
          .map(([ id, value ]) => ({ id, value }))
          .filter(({ id }) => profile[1].includes(id));

        context.response.body = render(<ProfileRelatedDataTabs profileId={profileId} personId={personId} selectedTab='Phone Numbers' className='col-span-2' items={phoneNumbers} />);
        break;

      }

      case 'preferences': {

        const preferencesResponse = await connection.queryArray(`
          SELECT
            profile_preference_value
          FROM
            profile_preference
          WHERE
            z_fk_profile = $profileId
          `,
          { profileId }
        );

        const preferences = preferencesResponse.rows.map(([ value ]) => ({ value }));

        context.response.body = render(<ProfileRelatedDataTabs profileId={profileId} personId={personId} selectedTab='Preferences' className='col-span-2' items={preferences} />);
        break;
      }

      default:
        context.response.body = 'An unexpected error has occurred';
        context.response.status = 500;
    }

  })
  .post('/edit', async (context) => {

    const profileId = parseInt(context.params.profileId);

    const data = await context.request.body.form();

    const profileName = data.get('Profile Name');
    const ff5 = data.get('FF5');

    const profileUpdateResponse = await connection.queryArray(`
      UPDATE
        profile
      SET
        profile_name = $profileName,
        profile_ff5 = $ff5
      WHERE
        z_pk_profile = $profileId
      `,
      { profileId, profileName, ff5 }
    );

    const profile = {
      id: profileId,
      profileName: profileName,
      profileFf5: ff5
    };

    context.response.body = render(<p>Profile change submitted</p>)

  });

export default routerProfile;