import React from "react";

const AboutMePage = () => {
  return (
    <div className=" bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Team</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Korrawit Opassamutchai
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Student ID: 630615017
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Navaporn Leesuravanich
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Student ID: 630615025
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Supachot Suksawat
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Student ID: 630615040
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Sorawich Yeampraseot
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Student ID: 630615042
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
