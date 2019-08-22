INSERT INTO users (name, email, password)
VALUES ('Risyardi','elyeel@yahoo.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Gurpreet Jhutty', 'g.jhutty06@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('James Lin', 'jimlin@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, street, parking_spaces, number_of_bathrooms, number_of_bedrooms, country,
  city, province, post_code, active)
VALUES (1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
  930.61, 6 , 4, 8, 'Canada', '536 Namsub Highway', 'Sotboske', 'Quebec', 28142, true),
  (1, 'Blank corner', 'description', 
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 
  85234, 6, 6, 7, 'Canada', '651 Nami Road', 'Bohbatev', 'Alberta', 83680, true),
  (3, 'Habit mix', 'description', 
  'https://images.pexels.com/photos/2080018/pexels-phto-2080018.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2080018/pexels-phto-2080018.jpeg',
  46058, 0, 5, 6, 'Canada', '1650 Hejto Center', 'Genwezuj', 'Newfoundland And Labrador', 44583, true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 313, 399),
('2019-01-04', '2019-02-01', 515, 628),
('2021-10-01', '2021-10-14', 217, 93);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 5, 10, 3, 'message'),
(1, 4, 1, 4, 'message'),
(2, 4, 1, 4, 'message');
