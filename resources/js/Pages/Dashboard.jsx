import React from "react";
import Layout from "@/components/layout";
import DatePicker from "@/components/date-picker";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
    return (
        <Layout>
            <div className="flex justify-between items-center mb-7 flex-wrap">
            <h1 className="text-3xl sm:text-2xl font-bold">Dashboard</h1>

                <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">
                    <DatePicker />
                    <Button>
                        <Filter className="2-4 h-4 mr-1" /> Filter
                    </Button>
                </div>
            </div>

        </Layout>
    );
};

export default Dashboard;
