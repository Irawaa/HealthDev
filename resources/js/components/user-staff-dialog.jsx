import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

const UserStaffDialog = ({ staff, onClose }) => {
    const [isRegistered, setIsRegistered] = useState(false);
    // Check if the staff has a user account
    useEffect(() => {
        setIsRegistered(!!staff?.user_id);
    }, [staff]);

    // Registration Form
    const registrationForm = useForm({
        username: "",
        password: "",
        confirmPassword: "",
        password_confirmation: "",
        staff_id: staff?.staff_id ?? "",
    });


    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Registering with data:", registrationForm.data);
        if (registrationForm.data.password !== registrationForm.data.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        registrationForm.post("/user/register", {
            onSuccess: () => {
                console.log("Registration successful");
                toast.success("User registered successfully!");
                setIsRegistered(true);
                onClose();
            },
            onError: (errors) => {
                toast.error("Registration failed. Please try again.");
                console.error("Registration errors:", errors);
            }
        });
    };

    // Change Password Form
    const changePasswordForm = useForm({
        password: "",
        password_confirmation: "", // ✅ Must match Laravel validation
        staff_id: staff?.staff_id ?? "",
    });

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (changePasswordForm.data.password !== changePasswordForm.data.password_confirmation) {
            toast.error("Passwords do not match!");
            return;
        }
        changePasswordForm.put("/user/change-password", {
            onSuccess: (response) => {
                console.log("Response:", response);
                toast.success("Password changed successfully!");
                changePasswordForm.reset();
                onClose();
            },
            onError: (errors) => {
                toast.error("Failed to change password.");
                console.error("Change password errors:", errors);
            },
        });
    };

    return (
        <div>
            {isRegistered ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <h2 className="text-xl font-bold">Change Password</h2>
                    <div>
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={changePasswordForm.data.password}
                            onChange={(e) =>
                                changePasswordForm.setData("password", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            type="password"
                            name="password_confirmation" // ✅ Must be exactly this
                            value={changePasswordForm.data.password_confirmation}
                            onChange={(e) =>
                                changePasswordForm.setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                    </div>
                    <Button type="submit" disabled={changePasswordForm.processing}>
                        Change Password
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                    <h2 className="text-xl font-bold">Register Account</h2>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            name="username"
                            value={registrationForm.data.username}
                            onChange={(e) =>
                                registrationForm.setData("username", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={registrationForm.data.password}
                            onChange={(e) =>
                                registrationForm.setData("password", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={registrationForm.data.confirmPassword}
                            onChange={(e) =>
                                registrationForm.setData("confirmPassword", e.target.value)
                            }
                            required
                        />
                    </div>
                    <Button type="submit" disabled={registrationForm.processing}>
                        Register
                    </Button>
                </form>
            )}
        </div>
    );
};

export default UserStaffDialog;
