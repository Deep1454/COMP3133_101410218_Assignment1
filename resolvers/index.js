const Employee = require("../models/Employee");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolvers = {
    Query: {

        // User Login
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            // user authentication by matching credentials.
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) throw new Error("Invalid credentials");

            // JWT Token expiration
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { token, user };
        },
        // Get all employees
        getAllEmployees: async () => await Employee.find(),

        // Find employee by ID
        findEmployeeById: async (_, { id }) => await Employee.findById(id),

        // Find employees by position or department
        findEmployeesByPositionOrDepartment: async (_, { position, department }) => {
            const filter = {};
            if (position) filter.position = position;
            if (department) filter.department = department;
            return await Employee.find(filter);
        }
    },
    Mutation: {
        // User Signup
        signup: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error("Email is already registered.");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();
            return newUser;
        },



        // Add new Employee
        addEmployee: async (_, { firstName, lastName, email, gender, position, salary, joinDate, department, profileImage }) => {
            let imagePath = null;

            if (profileImage) {
                console.log("Received File:", profileImage); // Debugging step

                const { filename, createReadStream } = await profileImage.promise;
                
                if (!filename) {
                    throw new Error("Invalid file upload: filename missing");
                }

                console.log("File Name:", filename);

                const uploadDir = path.join(__dirname, "../uploads");

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const filePath = path.join(uploadDir, filename);
                const stream = createReadStream();

                console.log("Saving File To:", filePath);

                await new Promise((resolve, reject) => {
                    const writeStream = fs.createWriteStream(filePath);
                    stream.pipe(writeStream);
                    writeStream.on("finish", resolve);
                    writeStream.on("error", reject);
                });

                imagePath = `/uploads/${filename}`;
            } else {
                console.log("No file received");
            }

            const newEmployee = new Employee({
                firstName,
                lastName,
                email,
                gender,
                position,
                salary,
                joinDate,
                department,
                profileImage: imagePath
            });

            return await newEmployee.save();
        },

        // Update Employee by ID
        updateEmployee: async (_, { id, firstName, lastName, email, gender, position, salary, joinDate, department, profileImage }) => {
            const updatedFields = {};
            if (firstName) updatedFields.firstName = firstName;
            if (lastName) updatedFields.lastName = lastName;
            if (email) updatedFields.email = email;
            if (gender) updatedFields.gender = gender;
            if (position) updatedFields.position = position;
            if (salary) updatedFields.salary = salary;
            if (joinDate) updatedFields.joinDate = joinDate;
            if (department) updatedFields.department = department;

            if (profileImage) {
                const { createReadStream, filename } = await profileImage;
                const savePath = path.join(__dirname, "../uploads", filename);
                await new Promise((resolve, reject) => {
                    createReadStream().pipe(fs.createWriteStream(savePath))
                        .on("finish", resolve)
                        .on("error", reject);
                });
                updatedFields.profileImage = `/uploads/${filename}`;
            }

            const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedEmployee) throw new Error("Employee not found");

            return updatedEmployee;
        },

        // Remove Employee
        removeEmployee: async (_, { id }) => {
            const deleted = await Employee.findByIdAndDelete(id);
            if (!deleted) throw new Error("Employee not found");
            return "Employee removed successfully";
        }
    }
};

module.exports = resolvers;
