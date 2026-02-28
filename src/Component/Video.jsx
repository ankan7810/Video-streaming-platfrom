import React from "react";

const videos = [
  {
    id: 1,
    title: "Travelling Twilight – A Cinematic Journey",
    thumbnail:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    channel: "Travel World",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    views: "1.2M views",
    time: "3 days ago",
    duration: "10:24",
  },
  {
    id: 2,
    title: "Photography Hub – Iceland Nature",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    channel: "Photo Master",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/147/147144.png",
    views: "890K views",
    time: "1 week ago",
    duration: "8:45",
  },
  {
    id: 3,
    title: "Mountain Adventure Documentary",
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    channel: "Nature Life",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    views: "540K views",
    time: "2 weeks ago",
    duration: "12:11",
  },
  {
    id: 4,
    title: "Ocean Sunset Relaxing Video",
    thumbnail:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
    channel: "Travel Vibes",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    views: "2.1M views",
    time: "1 month ago",
    duration: "9:32",
  },
];

const Video = () => {
  return (
    <div className="px-6 py-6 ">

      {/* Center Container */}
      <div className="max-w-screen-2xl mx-auto">

        <div
          className="
          grid gap-8
           grid-cols-[repeat(auto-fit,minmax(270px,1fr))]
        "
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="cursor-pointer group transition duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-xl"
                />

                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="flex gap-5 mt-3">
                <img
                  src={video.avatar}
                  alt="channel"
                  className="w-9 h-9 rounded-full"
                />

                <div>
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-500 transition">
                    {video.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {video.channel}
                  </p>

                  <p className="text-xs text-gray-500">
                    {video.views} • {video.time}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Video;