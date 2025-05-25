// Migration to create tbl_venue_list and insert default data
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_venue_list", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      venue_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      venue_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      venue_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // Insert default data
    await queryInterface.sequelize.query(`
      INSERT INTO tbl_venue_list (venue_name, venue_type, description, slug, venue_address, longitude, latitude)
      VALUES
        ('Reflections Restaurant', 'Restaurant', 'A popular dining spot in Masvingo.', 'reflections-restaurant', '6834 Industrial Road, Masvingo', 30.8324, -20.0723),
        ('Creamy Inn Zimbabwe', 'Restaurant', 'A well-known fast-food venue.', 'creamy-inn-zimbabwe', 'A4, Masvingo, Zimbabwe', 30.8290, -20.0756),
        ('Liquids Bar', 'Bar', 'A lively bar in Masvingo known for its great atmosphere.', 'liquids-bar', '29 Hellet Street, Masvingo', 30.8352, -20.0781),
        ('Masvingo Downtown Lodge', 'Lodge', 'Provides accommodation, conferencing, and food services.', 'masvingo-downtown-lodge', '446 Hebert Chitepo St, Masvingo', 30.8310, -20.0699),
        ('Regency Hotel Chevron', 'Hotel', 'A hotel offering accommodations and event hosting.', 'regency-hotel-chevron', '2 Robert Mugabe Way, Masvingo', 30.8345, -20.0738),
        ('DB Stopover SPAR', 'Restaurant', 'A popular stopover spot for food and drinks.', 'db-stopover-spar', 'VR6R+4PP, Masvingo, Zimbabwe', 30.8371, -20.0712),
        ('Great Zimbabwe Hotel', 'Hotel', 'A historic hotel near the Great Zimbabwe ruins.', 'great-zimbabwe-hotel', 'Great Zimbabwe, Masvingo', 30.8490, -20.0735),
        ('Charles Austin Theatre', 'Event Center', 'A well-known venue for cultural events and performances.', 'charles-austin-theatre', '5 R. Mugabe Way, Masvingo', 30.8306, -20.0678),
        ('Masvingo Golf Club', 'Golf Course', 'A scenic golf course in Masvingo.', 'masvingo-golf-club', 'Golf Club Rd, Masvingo', 30.8358, -20.0802),
        ('Masvingo Museum', 'Museum', 'A museum showcasing the history and culture of the region.', 'masvingo-museum', 'Museum Rd, Masvingo', 30.8315, -20.0701),
        ('Masvingo Sports Club', 'Sports Club', 'A venue for various sports activities and events.', 'masvingo-sports-club', 'Sports Club Rd, Masvingo', 30.8340, -20.0790),
        ('Masvingo Showgrounds', 'Event Center', 'A venue for exhibitions and trade shows.', 'masvingo-showgrounds', 'Showgrounds Rd, Masvingo', 30.8360, -20.0740),
        ('Dopiro Lodge and Gardens', 'Wedding Venue', 'A serene venue with manicured gardens, perfect for weddings and events.', 'dopiro-lodge-gardens', 'Plot 14-15 Flesk Morningside, Masvingo', 30.8401, -20.0685),
        ('Masvingo Baptist Church', 'Church', 'A well-known place of worship and community gatherings.', 'masvingo-baptist-church', '123 Church Street, Masvingo', 30.8328, -20.0702)
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("tbl_venue_list");
  },
};
