// https://tiranga.mobileappdemo.net/api/register

// {
//     "mobile":"1234567891",
//      "password":"123456"
   
// }

// {
//     "status": 200,
//     "message": "User is created successfully.",
//     "id": 3,
//     "mobile": "1234567891"
// }









// https://root.codingjourney.in/api/dragon_bet

// {
//     "userid":"1",
//     "game_id":"10",
//     "json": [
//         {"number": 1, "amount": 20}, 
//         {"number": 2, "amount": 20}
//        ]
// }

// {
//     "status": 200,
//     "message": "Bet Successfully Placed"
// }




// https://root.codingjourney.in/api/bet_history?userid=1&game_id=10


// {
//     "status": 200,
//     "message": "Data found",
//     "total_bets": 2,
//     "data": [
//         {
//             "id": 134,
//             "amount": 20,
//             "commission": 0,
//             "trade_amount": 20,
//             "win_amount": 0,
//             "number": 2,
//             "win_number": null,
//             "gamesno": 111598358,
//             "game_id": 10,
//             "userid": 1,
//             "order_id": "2025011312253748161",
//             "status": 0,
//             "created_at": "2025-01-13 12:25:37",
//             "updated_at": "2025-01-13 12:25:37",
//             "game_name": "Dragon Tiger",
//             "name": "Tiger"
//         },
//         {
//             "id": 133,
//             "amount": 20,
//             "commission": 0,
//             "trade_amount": 20,
//             "win_amount": 0,
//             "number": 1,
//             "win_number": null,
//             "gamesno": 111598358,
//             "game_id": 10,
//             "userid": 1,
//             "order_id": "2025011312253748161",
//             "status": 0,
//             "created_at": "2025-01-13 12:25:37",
//             "updated_at": "2025-01-13 12:25:37",
//             "game_name": "Dragon Tiger",
//             "name": "Dragon"
//         }
//     ]
// }



// https://root.codingjourney.in/api/results?game_id=10&limit=10


// {
//     "status": 200,
//     "message": "Data found",
//     "data": [
//         {
//             "id": 200689,
//             "number": 3,
//             "gamesno": 111598357,
//             "game_id": 10,
//             "json": "[\"11\",\"11\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:29:44",
//             "updated_at": "2024-12-05 00:29:44",
//             "game_name": "Tie",
//             "game_number": 3,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200685,
//             "number": 3,
//             "gamesno": 111598356,
//             "game_id": 10,
//             "json": "[\"3\",\"3\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:29:43",
//             "updated_at": "2024-12-05 00:29:43",
//             "game_name": "Tie",
//             "game_number": 3,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200677,
//             "number": 1,
//             "gamesno": 111598355,
//             "game_id": 10,
//             "json": "[\"14\",\"2\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:56",
//             "updated_at": "2024-12-05 00:28:56",
//             "game_name": "Dragon",
//             "game_number": 1,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200675,
//             "number": 2,
//             "gamesno": 111598354,
//             "game_id": 10,
//             "json": "[\"2\",\"11\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:55",
//             "updated_at": "2024-12-05 00:28:55",
//             "game_name": "Tiger",
//             "game_number": 2,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200673,
//             "number": 3,
//             "gamesno": 111598353,
//             "game_id": 10,
//             "json": "[\"4\",\"4\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:54",
//             "updated_at": "2024-12-05 00:28:54",
//             "game_name": "Tie",
//             "game_number": 3,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200670,
//             "number": 3,
//             "gamesno": 111598352,
//             "game_id": 10,
//             "json": "[\"5\",\"5\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:53",
//             "updated_at": "2024-12-05 00:28:53",
//             "game_name": "Tie",
//             "game_number": 3,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200667,
//             "number": 2,
//             "gamesno": 111598351,
//             "game_id": 10,
//             "json": "[\"2\",\"11\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:52",
//             "updated_at": "2024-12-05 00:28:52",
//             "game_name": "Tiger",
//             "game_number": 2,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200664,
//             "number": 1,
//             "gamesno": 111598350,
//             "game_id": 10,
//             "json": "[\"13\",\"2\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:51",
//             "updated_at": "2024-12-05 00:28:51",
//             "game_name": "Dragon",
//             "game_number": 1,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200660,
//             "number": 2,
//             "gamesno": 111598349,
//             "game_id": 10,
//             "json": "[\"2\",\"13\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:51",
//             "updated_at": "2024-12-05 00:28:51",
//             "game_name": "Tiger",
//             "game_number": 2,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         },
//         {
//             "id": 200653,
//             "number": 3,
//             "gamesno": 111598348,
//             "game_id": 10,
//             "json": "[\"8\",\"8\"]",
//             "random_card": "0",
//             "token": null,
//             "block": null,
//             "status": 1,
//             "created_at": "2024-12-05 00:28:49",
//             "updated_at": "2024-12-05 00:28:49",
//             "game_name": "Tie",
//             "game_number": 3,
//             "game_gameid": 10,
//             "game_setting_name": "Dragon Tiger"
//         }
//     ]
// }