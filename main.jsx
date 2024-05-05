// import routePeople from './routes/people.jsx';
import { render } from 'https://cdn.skypack.dev/preact-render-to-string@v5.1.12';
import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';

import People from './templates/People.jsx';
import Layout from './templates/Layout.jsx';
import Person from './templates/person/Person.jsx';
import ProfileTabs from './templates/person/ProfileTabs.jsx';
import Index from './templates/Index.jsx';
import PersonRelatedDataTabs from './templates/person/PersonRelatedDataTabs.jsx';
import ProfileRelatedDataTabs from './templates/person/ProfileRelatedDataTabs.jsx';

import r from './utils/r.jsx';

const db = await Deno.openKv();
const router = new Router();
const app = new Application();

router
  .get('/', context => {
    context.response.body = r(<Index />);
  })
  .get('/people', async (context) => {
    const people = await Array.fromAsync(db.list({ prefix: ['person'] }));
    context.response.body = r(<People people={people} />);
  })
  .get('/people/:personId', async (context) => {
    
    const personId = parseInt(context.params.personId);

    if (!personId) {
      context.response.body = 'Bad request';
      context.response.status = 418;
    } else {
      const person = await db.get(['person', personId]);
      const profiles = db.list({ prefix: ['profile', personId] });

      const personJson = person;
      const profilesJson = await Array.fromAsync(profiles);

      personJson.value.profiles = profilesJson;

      try {
        context.response.body = r(<Person person={person} />);
      } catch (err) {
        console.error(err);
        context.response.body = JSON.stringify(err);
        context.response.status = 500;
      }
    }

  })
  .get('/people/:personId/profiles/:profileId', async (context) => {

    const personId = parseInt(context.params.personId);
    const profileId = parseInt(context.params.profileId);

    const person = await db.get(['person', personId]);
    const profiles = await Array.fromAsync(db.list({ prefix: ['profile', personId] }));
    const selectedProfile = await db.get(['profile', personId, profileId]);

    context.response.body = render(
      <ProfileTabs
        person={person}
        profiles={profiles}
        selectedProfile={selectedProfile}
        personId={personId}
      />
    );

  })
  .get('/people/:personId/:relatedDataTab', async (context) => {

    const personId = parseInt(context.params.personId)
    const relatedDataTab = context.params.relatedDataTab;

    const person = await db.get(['person', personId]);

    switch (relatedDataTab) {
      case 'email-addresses':
        context.response.body = render(<PersonRelatedDataTabs person={person} selectedTab='Email Addresses' />);
        break;

      case 'phone-numbers':
        context.response.body = render(<PersonRelatedDataTabs person={person} selectedTab='Phone Numbers' />);
        break;
      
      default:
        context.response.body = 'An unexpected error has occurred';
        context.response.status = 500;
    }
    

  })
  .get('/people/:personId/profiles/:profileId/:relatedDataTab', async (context) => {

    const personId = parseInt(context.params.personId);
    const profileId = parseInt(context.params.profileId);
    const relatedDataTab = context.params.relatedDataTab;

    const person = await db.get(['person', personId]);
    const profile = await db.get(['profile', personId, profileId]);

    switch (relatedDataTab) {
      case 'email-addresses':
        context.response.body = render(<ProfileRelatedDataTabs person={person} profile={profile} personId={personId} selectedTab='Email Addresses' />);
        break;

      case 'phone-numbers':
        context.response.body = render(<ProfileRelatedDataTabs person={person} profile={profile} personId={personId} selectedTab='Phone Numbers' />);
        break;

      case 'preferences':
        context.response.body = render(<ProfileRelatedDataTabs person={person} profile={profile} personId={personId} selectedTab='Preferences' />);
        break;
      
      default:
        context.response.body = 'An unexpected error has occurred';
        context.response.status = 500;
    }

  });

app.use(async (context, next) => {
  context.response.headers.set('Content-Type', 'text/html');
  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });