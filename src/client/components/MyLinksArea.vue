<script setup>
  const props = defineProps({
    layout: {
      type: String,
      default: 'layout1',
    },
  })
  const areas = {
    layout1: {
      className: 'layout1',
      sections: [
        {
          links: 2,
          size: 64,
        },
        {
          links: 3,
          size: 48,
        },
        {
          links: 3,
          size: 48,
        },
        {
          links: 12,
          size: 24,
        },
      ],
      linkCount: [2, 3, 3, 12],
      maxLinks: 20,
    },
    layout2: {
      className: 'layout2',
      sections: [
        {
          links: 6,
          size: 48,
        },
        {
          links: 6,
          size: 48,
        },
        {
          links: 6,
          size: 24,
        },
        {
          links: 6,
          size: 24,
        },
      ],
      linkCount: [6, 6, 6, 6],
      maxLinks: 24,
    },
    layout3: {
      className: 'layout3',
      sections: [
        {
          links: 6,
          size: 48,
        },
        {
          links: 12,
          size: 24,
        },
        {
          links: 12,
          size: 24,
        },
        {
          links: 12,
          size: 24,
        },
      ],
      linkCount: [6, 12, 12, 12],
      maxLinks: 42,
    },
    layout4: {
      className: 'layout4',
      sections: [
        {
          links: 2,
          size: 64,
        },
        {
          links: 2,
          size: 64,
        },
        {
          links: 6,
          size: 24,
        },
        {
          links: 6,
          size: 24,
        },
      ],
      linkCount: [2, 2, 6, 6],
      maxLinks: 16,
    },
  }
  const myArea = areas[props.layout]
  const myLinks = [
    { href: 'https://archlinux.org', title: 'Archlinux' },
    { href: 'https://duckduckgo.com', title: 'Duckduckgo' },
  ]
  let linkIndex = 0
  function getLink(section, i) {
    let link = Object.assign({}, { ...myLinks[linkIndex] })
    if (!myLinks[linkIndex]) {
      link = Object.assign({}, { ...myLinks[i % myLinks.length] }) // {href: null, title: 'noname'}
    }
    link.index = linkIndex
    link.num = i
    link.section = section
    link.total = myArea.maxLinks
    linkIndex++
    return link
  }
</script>

<template>
  <div class="container" :class="myArea.className">
    <section
      v-for="(section, sectionIndex) in myArea.sections"
      :class="'area' + (sectionIndex + 1)"
      :key="sectionIndex"
    >
      <MyLink
        v-for="linkIndex in section.links"
        :key="linkIndex"
        :size="section.size"
        :link="getLink(section.links, linkIndex)"
      />
    </section>
  </div>
</template>

<style scoped>
  .v-btn--size-small {
    min-width: 40px;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-auto-columns: 6fr 1fr;
    grid-auto-rows: 1fr;
    gap: 5px 5px;
    grid-auto-flow: row;

    & section {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 5px;

      & .v-card {
        flex: 1;
      }
    }
  }

  .layout1 {
    grid-template-areas:
      'area1 area2'
      'area1 area2'
      'area1 area3'
      'area1 area3'
      'area4 area4';
  }

  .layout2 {
    grid-template-areas:
      'area1 area1'
      'area1 area1'
      'area2 area2'
      'area2 area2'
      'area3 area4';
  }

  .layout3 {
    grid-template-areas:
      'area1 area1'
      'area1 area1'
      'area2 area2'
      'area3 area3'
      'area4 area4';
  }

  .layout4 {
    grid-template-areas:
      'area1 area2'
      'area1 area2'
      'area1 area2'
      'area1 area2'
      'area3 area4';
  }

  .area1 {
    grid-area: area1;
  }

  .area2 {
    grid-area: area2;
  }

  .area3 {
    grid-area: area3;
  }

  .area4 {
    grid-area: area4;
  }
</style>
