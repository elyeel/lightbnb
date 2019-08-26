const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
    SELECT * FROM users
    WHERE email = $1;
  `, [email])
  .then(res => {
    if (res) {
      return res.rows[0];
    } else {
      return null;
    }
  })
  .catch(err => console.error('query error', err.stack));
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
    SELECT * FROM users
    WHERE id = $1;
  `, [id])
  .then(res => {
    if (res) {
      return res.rows[0];
    } else {
      return null;
    }
  })
  .catch(err => console.error('query error', err.stack));
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
    INSERT INTO users(name, email, password)
    VALUES($1 ,$2, $3)
    RETURNING *;
  `, [user.name, user.email, user.password])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT
      properties.id AS id,
      title,
      cost_per_night,
      start_date,
      end_date,
      avg(rating) as rating,
      cover_photo_url,
      thumbnail_photo_url
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE end_date < NOW()::DATE AND
      reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    limit $2;
  `, [guest_id, limit])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // const limitedProperties = {};
  const queryParams = [];
  const base = 10;
  let counter = 0;
  let queryString = `
  SELECT properties.*,
    avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id  
  `;

  if (options.city) {
    counter++;
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city ILIKE $${queryParams.length} 
    `;
  }  

  if (options.owner_id) {
    counter++;
    queryParams.push(options.owner_id);
    if (counter === 2) {
      queryString += `AND owner_id = $${queryParams.length} 
      `;
      console.log('Got here!');
    } else if (counter === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} 
      `;
    }
  };

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    counter += 2;
    console.log('string ?', Number.isInteger(options.maximum_price_per_night));
    const min = parseInt(options.minimum_price_per_night, base);
    const max = parseInt(options.maximum_price_per_night, base);
    queryParams.push(min);
    queryString += `AND cost_per_night >= $${queryParams.length} 
    `;
    queryParams.push(max);
    queryString += `AND cost_per_night <= $${queryParams.length} 
    `;
  };

  queryString += `GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    counter ++;
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} 
    `;
  }


  // if 
  // switch case

  // if (options.owner_id) {
  //   queryParams.push(`${options.owner_id}`);
  //   queryString += `WHERE owner_id = $${queryParams.length}`;
  // }


  
  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);


  // original code
  // return pool.query(`
  // SELECT properties.id as id, 
  //   title,
  //   cost_per_night*100 as cost_per_night,
  //   avg(property_reviews.rating) as average_rating,
  //   thumbnail_photo_url
  // FROM properties
  // JOIN property_reviews ON properties.id = property_id
  // WHERE city LIKE $1 OR
  //   cost_per_night > $2 OR
  //   cost_per_night < $3
  // GROUP BY properties.id
  // HAVING avg(property_reviews.rating) >= 3
  // ORDER BY cost_per_night
  // LIMIT $5;
  // `, [options.city, options.minimum_price_per_night, 100*options.maximum_price_per_night, options.minimum_rating, limit])
  // .then(res => res.rows)
  // .catch(err => console.error('query error', err.stack));
  // .catch(err => console.error('query error', err.stack));
  // return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url,
    cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
    country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING * ;`;

  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url,
    property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms,
    property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];

  return pool.query(queryString, values)
  .then(res => res.rows[0]);
  
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
