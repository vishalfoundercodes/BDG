import { assets } from "./assets";

const names = [
  "Rajesh", "Aarav", "Sanya", "Kiran", "Aditya", "Neha", "Vikram", "Rhea",
  "Ananya", "Arjun", "Tanya", "Kabir", "Meera", "Rohan", "Isha", "Aman",
  "Priya", "Krish", "Sneha", "Yash", "Simran", "Manav", "Diya", "Aryan",
  "Pooja", "Rahul", "Anjali", "Veer", "Alia", "Ritesh", "Nisha", "Gaurav",
  "Poonam", "Siddharth", "Sara", "Nikhil", "Maya", "Naveen", "Ira", "Ravi",
  "Ishaan", "Aditi", "Karthik", "Esha", "Varun", "Payal", "Dev", "Ritika",
  "Akash", "Shruti", "Kavya", "Samar", "Naina", "Om", "Pari", "Abhay", "Zara",
  "Anirudh", "Lavanya", "Tushar", "Megha", "Vani", "Ashwin", "Kavitha", "Ritu",
  "Harsh", "Avantika", "Darsh", "Sakshi", "Jatin", "Anya", "Vivek", "Nidhi",
  "Ayaan", "Pallavi", "Karan", "Nandini", "Akhil", "Geet", "Pranav", "Komal",
  "Raj", "Sonal", "Manish", "Divya", "Raghav", "Rupali", "Jay", "Amrita",
  "Pratik", "Neel", "Swati", "Kush", "Asmita", "Aarohi", "Sameer", "Shreya",
];

export const players = Array.from({ length: 100 }, (_, index) => ({
  name: names[index % names.length],
  bgImage: assets.vip[index % assets.vip.length],
  img: assets.persons[index % assets.persons.length],
}));

