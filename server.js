// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';


console.log('Hieronder moet je waarschijnlijk nog wat veranderen')
// Doe een fetch naar de data die je nodig hebt
// const apiResponse = await fetch('...')

const apiResponse = await fetch('https://fdnd-agency.directus.app/items/milledoni_products')
const apiResponseJSON = await apiResponse.json()


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
  // Geef hier eventueel data aan mee
  response.render('index.liquid', { items: apiResponseJSON.data })
})

app.get('/cadeau/:slug', async function (request, response) {
  const slug = request.params.slug;
  const apiResponseCadeau = await fetch(`https://fdnd-agency.directus.app/items/milledoni_products?filter={"slug":"${slug}"}&limit=1`)

  // Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
  const apiResponseCadeauJSON = await apiResponseCadeau.json()

  // Controleer eventueel de data in je console
  // (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
  // console.log(apiResponseJSON.data)
  
  // Geef hier eventueel data aan mee
  response.render('cadeau.liquid', { item: apiResponseCadeauJSON.data[0], items: apiResponseJSON.data})
})

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt


app.post('/:itemId', async function (request, response) {
 
  await fetch('https://fdnd-agency.directus.app/items/milledoni_users_milledoni_products', {
    method: 'POST',
    body: JSON.stringify({
        milledoni_products_id: request.params.itemId,
        milledoni_users_id: 4
    }),
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
});
 
  //Redirect naar de homepage
  response.redirect(303, '/');
});

//const savedProductsURL = 'https://fdnd-agency.directus.app/items/milledoni_users_milledoni_products';
 
//const idRes = await fetch(`${savedProductsURL}?filter={"milledoni_products_id":${request.params.itemId},"milledoni_users_id":4}`);

//const idJson = await idRes.json();

//const id = idJson.data[0].id;
 
//await fetch(`${savedProductsURL}/${id}`, {

  //  method: 'DELETE',

    //headers: {

      //  'Content-Type': 'application/json;charset=UTF-8'

   // }

//});
 

  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


app.use((req, res, next) => {
  res.status(404).send("Deze pagina bestaat niet!")
})

