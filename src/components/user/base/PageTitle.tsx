
const PageTitle = function ({ title, tag }: { title: string, tag: string}) {
    return (
        <section className="mb-8">
            <h1 className="text-2xl font-bold text-[#004a7c] mb-2">
            {title}
          {/* Profile &amp; Settings */}
        </h1>
            <p className="text-gray-500 text-base">
                {tag}
          {/* Manage your account settings and preferences */}
            </p>
      </section>
    )
}

export default PageTitle;
