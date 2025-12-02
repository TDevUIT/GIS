"use client";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Lê Thanh Tài – 22521276",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764683955/impznddlcnftslzmbfn9.jpg",
  },
  {
    name: "Nguyễn Trần Hương Giang – 22520359",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764684151/ug21yyd53ilkr4ihbvil.jpg",
  },
  {
    name: "Bùi Quốc Lâm – 22520733",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764684014/y94aywztbbaqpcovbz5f.jpg",
  },
  {
    name: "Châu Trần Vỹ Linh – 22520755",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764684000/ckntz04w0aayxygwsk1o.jpg",
  },
  {
    name: "Nguyễn Văn Quyền – 22521223",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764684173/zz74sn91inogao6v6ezi.jpg",
  },
  {
    name: "Võ Nhật Tân – 22521313",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764683970/k1sdvnzoz6x80ydbhq4u.jpg",
  },
  {
    name: "Nguyễn Công Thắng – 22521330",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764683985/hnj9hdmvxgscexrsyufi.png",
  },
  {
    name: "Tạ Văn Thái – 22521377",
    role: "Web Developer",
    image: "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1764684047/le7pkqp2fjcf9tvucqtl.jpg",
  },
];

const TeamList = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          Đội ngũ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold tracking-wide">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-300 uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamList;
