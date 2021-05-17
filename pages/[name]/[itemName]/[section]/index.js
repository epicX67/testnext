import Head from "next/head";
import Link from "next/link";
import { Router } from "next/router";

export default function Section({
  posts,
  itemName,
  section,
  acc = "blue",
  logo = "ri-dashboard-fill",
}) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </Head>

      <main>
        <div className={`subSideBar ${acc}`}>
          <button>
            <i className={logo}></i>
          </button>
          <div></div>

          <button className="backButton">
            <i className="ri-arrow-go-back-fill"></i>
          </button>
        </div>
        <section className="postSection">
          <h1>
            {itemName} / <span>{section}</span>
          </h1>
          <div className="listPost">
            {posts.map((post) => (
              <div className="item">
                <div className="thumbnail">
                  <img src={post.thumbnail} alt="" />
                </div>
                <div className="container">
                  <h1>{post.title}</h1>
                  <p>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const { name, itemName, section } = context.params;
  const URL = "https://raw.githubusercontent.com/epicX67/md_blogs/main";

  const mUrl = `${URL}/categories/${name}/${itemName}/${section}/posts.json`;
  const sUrl = `${URL}/categories/${name}.json`;

  const res = await fetch(mUrl);
  const posts = await res.json();

  const sRes = await fetch(sUrl);
  const sData = await sRes.json();

  const sItem = sData.items.find((item) => itemName === item.name);
  const logo = sItem.options.find((item) => item.name === section).logo;

  return {
    props: {
      posts: posts,
      itemName: itemName,
      section: section,
      logo: logo,
      acc: sData.configs.acc,
    },
  };
}

export async function getStaticPaths() {
  const URL = "https://raw.githubusercontent.com/epicX67/md_blogs/main";
  const mUrl = `${URL}/DB.json`;
  const res = await fetch(mUrl);
  const data = await res.json();

  const names = data.map((item) => item);

  let paths = [];

  for (let i = 0; i < names.length; i++) {
    const cUrl = `${URL}/categories/${names[i].name.toLowerCase()}.json`;
    const cRes = await fetch(cUrl);
    const cData = await cRes.json();

    const items = cData.items.map((item) => item);
    for (let j = 0; j < items.length; j++) {
      for (let k = 0; k < items[j].options.length; k++) {
        //const sUrl = `${URL}/categories/${names[i]}/${items[j].options[k].name}/posts.json`;

        paths.push({
          params: {
            name: names[i].name.toLowerCase(),
            itemName: items[j].name,
            section: items[j].options[k].name,
          },
        });
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
}