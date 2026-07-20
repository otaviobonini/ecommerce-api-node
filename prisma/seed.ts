import { PrismaClient, Status } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Este seed é destrutivo: apaga TODOS os pedidos, produtos e usuários antes
  // de recriar os dados de exemplo. Rodá-lo contra o banco de produção apaga a
  // loja inteira, sem confirmação. A trava abaixo existe porque o .env do
  // servidor aponta pro banco de produção — um `npm run seed` no diretório
  // errado, ou um step a mais no pipeline de deploy, bastaria.
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DESTRUCTIVE_SEED) {
    throw new Error(
      "Seed destrutivo bloqueado: NODE_ENV=production. " +
        "Se isso é mesmo intencional, rode com ALLOW_DESTRUCTIVE_SEED=1.",
    );
  }

  console.log("🌱 Iniciando seed...");

  // ------------------------------------------------------------
  // Limpa o banco na ordem correta (respeita as foreign keys)
  // ------------------------------------------------------------
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Banco limpo.");

  // ------------------------------------------------------------
  // Usuários
  // ------------------------------------------------------------
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);
  const user2Password = await bcrypt.hash("maria123", 10);
  const user3Password = await bcrypt.hash("pedro123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "Admin",
      email: "admin@loja.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      username: "João Silva",
      email: "joao@email.com",
      hashedPassword: userPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "Maria Oliveira",
      email: "maria@email.com",
      hashedPassword: user2Password,
      role: "USER",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "Pedro Costa",
      email: "pedro@email.com",
      hashedPassword: user3Password,
      role: "USER",
    },
  });

  console.log(
    `👤 Usuários criados: ${admin.email}, ${user1.email}, ${user2.email}, ${user3.email}`,
  );

  // ------------------------------------------------------------
  // RefreshTokens (simulando sessões ativas)
  // ------------------------------------------------------------
  const now = new Date();
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.createMany({
    data: [
      {
        token: "rt_joao_abc123def456ghi789",
        expiresAt: in7days,
        userId: user1.userId,
      },
      {
        token: "rt_maria_xyz987uvw654rst321",
        expiresAt: in7days,
        userId: user2.userId,
      },
      {
        token: "rt_admin_qrs111tuu222vvv333",
        expiresAt: in30days,
        userId: admin.userId,
      },
    ],
  });

  console.log("🔑 RefreshTokens criados.");

  // ------------------------------------------------------------
  // Endereços
  // ------------------------------------------------------------
  const addr1 = await prisma.address.create({
    data: {
      userId: user1.userId,
      street: "Rua das Flores, 123",
      city: "Florianópolis",
      state: "SC",
      zipCode: "88000-000",
      isDefault: true,
    },
  });

  const addr1b = await prisma.address.create({
    data: {
      userId: user1.userId,
      street: "Av. Beira-Mar Norte, 500",
      city: "Florianópolis",
      state: "SC",
      zipCode: "88015-200",
      isDefault: false,
    },
  });

  const addr2 = await prisma.address.create({
    data: {
      userId: user2.userId,
      street: "Rua Augusta, 1200, Apto 42",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-100",
      isDefault: true,
    },
  });

  const addr3 = await prisma.address.create({
    data: {
      userId: user3.userId,
      street: "Rua XV de Novembro, 800",
      city: "Curitiba",
      state: "PR",
      zipCode: "80020-310",
      isDefault: true,
    },
  });

  const addrAdmin = await prisma.address.create({
    data: {
      userId: admin.userId,
      street: "Rua da Administração, 1",
      city: "Florianópolis",
      state: "SC",
      zipCode: "88010-000",
      isDefault: true,
    },
  });

  console.log("📍 Endereços criados.");

  // ------------------------------------------------------------
  // Categorias
  // ------------------------------------------------------------
  const [perifericos, cadeiras, monitores, audio, redes, armazenamento] =
    await Promise.all([
      prisma.category.create({
        data: {
          name: "Periféricos",
          categoryImage: "https://picsum.photos/seed/perifericos/300/200",
        },
      }),
      prisma.category.create({
        data: {
          name: "Cadeiras",
          categoryImage: "https://picsum.photos/seed/cadeiras/300/200",
        },
      }),
      prisma.category.create({
        data: {
          name: "Monitores",
          categoryImage: "https://picsum.photos/seed/monitores/300/200",
        },
      }),
      prisma.category.create({
        data: {
          name: "Áudio",
          categoryImage: "https://picsum.photos/seed/audio/300/200",
        },
      }),
      prisma.category.create({
        data: {
          name: "Redes",
          categoryImage: "https://picsum.photos/seed/redes/300/200",
        },
      }),
      prisma.category.create({
        data: {
          name: "Armazenamento",
          categoryImage: "https://picsum.photos/seed/armazenamento/300/200",
        },
      }),
    ]);

  console.log("🗂️  Categorias criadas.");

  // ------------------------------------------------------------
  // Produtos
  // ------------------------------------------------------------
  const productsData = [
    // Periféricos
    {
      productName: "Mouse Gamer RGB",
      productPrice: 150.0,
      stock: 30,
      productDescription:
        "Eleve sua performance com o Mouse Gamer RGB de sensor óptico de 16.000 DPI ajustável. Conta com 6 botões totalmente programáveis via software, iluminação RGB com 16 milhões de cores e efeitos sincronizáveis. Corpo ergonômico com revestimento antiderrapante garante conforto em sessões longas. Cabo trançado de 1,8m com conector dourado e pés em PTFE para deslizamento suave em qualquer superfície.",
      isFeatured: true,
      categoryId: perifericos.categoryId,
    },
    {
      productName: "Teclado Mecânico TKL",
      productPrice: 320.0,
      stock: 15,
      productDescription:
        "Teclado mecânico compacto no formato TKL (tenkeyless) com switches Red lineares para digitação rápida e silenciosa. Retroiluminação branca de alta intensidade com múltiplos modos de efeito. Estrutura em alumínio escovado resistente a respingos, anti-ghosting completo e rollover N-key para registrar todos os comandos simultâneos. Compatível com Windows e macOS.",
      isFeatured: false,
      categoryId: perifericos.categoryId,
    },
    {
      productName: "Mousepad XXL com RGB",
      productPrice: 89.9,
      stock: 50,
      productDescription:
        "Mousepad de tamanho XXL (90 x 40 cm) que cobre toda a área de trabalho, protegendo o mouse e o teclado ao mesmo tempo. Superfície de microtecido otimizada para sensores ópticos e a laser, com base em borracha antiderrapante de 4 mm de espessura. Bordas costuradas reforçadas evitam desgaste. Faixa de LED RGB nas bordas com 11 modos de iluminação e carregamento via USB-A.",
      isFeatured: false,
      categoryId: perifericos.categoryId,
    },
    {
      productName: "Webcam Full HD 1080p",
      productPrice: 210.0,
      stock: 20,
      productDescription:
        "Webcam com resolução Full HD 1080p a 30fps, ideal para videochamadas, lives e home office. Microfone estéreo integrado com cancelamento de ruído para voz nítida sem fone de ouvido. Foco automático rápido e correção de luz automática adaptam a imagem a qualquer ambiente. Clipe universal encaixa em monitores, laptops e tripés. Plug & Play via USB-A, sem necessidade de drivers.",
      isFeatured: true,
      categoryId: perifericos.categoryId,
    },
    // Monitores
    {
      productName: 'Monitor 27" 4K 144Hz',
      productPrice: 1350.0,
      stock: 8,
      productDescription:
        "Monitor IPS de 27 polegadas com resolução 4K (3840×2160) e taxa de atualização de 144Hz — a combinação perfeita para gamers e criadores de conteúdo. Cobertura de 98% do espaço de cor DCI-P3, certificação HDR400 e brilho de pico de 450 nits entregam cores vibrantes e precisas. Tempo de resposta de 1ms (GtG), compatível com FreeSync Premium e G-Sync. Suporte ajustável em altura, inclinação e rotação. 2× HDMI 2.1 + 1× DisplayPort 1.4.",
      isFeatured: true,
      categoryId: monitores.categoryId,
    },
    {
      productName: 'Monitor 24" Full HD',
      productPrice: 750.0,
      stock: 12,
      productDescription:
        "Monitor IPS de 24 polegadas com resolução Full HD (1920×1080) e taxa de atualização de 75Hz, perfeito para trabalho, estudo e entretenimento casual. Bordas ultrafinas de 3 lados para configurações multi-monitor. Suporte com ajuste de altura, inclinação e rotação VESA 100×100. Painel IPS com ângulo de visão de 178° e cobertura sRGB de 99%. Entradas HDMI e VGA. Certificado TÜV Rheinland para baixa emissão de luz azul.",
      isFeatured: false,
      categoryId: monitores.categoryId,
    },
    // Áudio
    {
      productName: "Headset Sem Fio 7.1",
      productPrice: 280.0,
      stock: 18,
      productDescription:
        "Headset gamer sem fio com som surround virtual 7.1 canais para imersão total. Drivers de 50mm com resposta de frequência de 20Hz a 20kHz reproduzem cada detalhe sonoro do jogo. Microfone cardioide retrátil com cancelamento de ruído garante comunicação cristalina. Bateria de 20 horas de duração com carregamento USB-C. Almofadas em espuma viscoelástica e arco ajustável para conforto prolongado. Alcance de 10 metros sem interferência.",
      isFeatured: true,
      categoryId: audio.categoryId,
    },
    {
      productName: "Caixa de Som Bluetooth",
      productPrice: 190.0,
      stock: 25,
      productDescription:
        "Caixa de som portátil com potência de 20W RMS e dois radiadores passivos para graves profundos. Conexão Bluetooth 5.0 com alcance de 15 metros e latência ultrabaixa. Certificação IPX5 — resistente a respingos e chuva leve, ideal para uso ao ar livre. Bateria de 3.600mAh com até 12 horas de reprodução. Função True Wireless Stereo (TWS) permite parear duas unidades para som estéreo. Entrada auxiliar P2 e carregamento USB-C.",
      isFeatured: false,
      categoryId: audio.categoryId,
    },
    // Cadeiras
    {
      productName: "Cadeira Gamer Pro",
      productPrice: 1599.9,
      stock: 5,
      productDescription:
        "Cadeira gamer de alto desempenho com estrutura de aço carbono e espuma moldada a frio de alta densidade que mantém o formato após anos de uso. Apoios de braço 4D ajustáveis em altura, profundidade, largura e ângulo. Encosto reclinável entre 90° e 180° com mecanismo de bloqueio em múltiplas posições. Almofadas lombar e cervical inclusas em couro PU premium. Suporta até 150 kg. Rodízios de nylon de 60mm silenciosos para pisos de madeira e vinílico.",
      isFeatured: true,
      categoryId: cadeiras.categoryId,
    },
    {
      productName: "Cadeira de Escritório",
      productPrice: 850.0,
      stock: 10,
      productDescription:
        "Cadeira executiva ergonômica com encosto em tela mesh respirável que mantém a temperatura corporal regulada durante longas jornadas. Assento em espuma D45 com revestimento em tecido antialérgico. Mecanismo Syncron permite inclinar o encosto mantendo o assento estável. Ajuste de altura por pistão a gás classe 4 (certificado SGS). Apoio de braços 2D. Base em alumínio polido com rodízios de 65mm em poliuretano. Suporta até 120 kg.",
      isFeatured: false,
      categoryId: cadeiras.categoryId,
    },
    // Redes
    {
      productName: "Roteador Wi-Fi 6 AX3000",
      productPrice: 420.0,
      stock: 22,
      productDescription:
        "Roteador Wi-Fi 6 (802.11ax) dual-band AX3000 com velocidade combinada de até 3.000 Mbps (574 Mbps em 2,4GHz + 2402 Mbps em 5GHz). Quatro antenas de alto ganho com beamforming focam o sinal nos dispositivos conectados. Tecnologias OFDMA e MU-MIMO atendem até 128 dispositivos simultaneamente sem queda de desempenho. Cobertura de até 150m². Processador dual-core 1,5GHz, 256 MB de RAM e porta USB 3.0 para compartilhamento de arquivos em rede.",
      isFeatured: true,
      categoryId: redes.categoryId,
    },
    {
      productName: "Switch 8 Portas Gigabit",
      productPrice: 180.0,
      stock: 35,
      productDescription:
        "Switch não gerenciado com 8 portas RJ-45 10/100/1000 Mbps para expansão de rede cabeada com desempenho Gigabit. Capacidade de comutação de 16 Gbps e taxa de encaminhamento de 11,9 Mpps garantem transferências rápidas entre dispositivos. Tecnologia de economia de energia IEEE 802.3az (EEE) reduz o consumo em até 50% em portas ociosas. Gabinete metálico compacto para rack ou desktop. Plug & Play, sem configuração necessária. Ideal para home office e PMEs.</p>",
      isFeatured: false,
      categoryId: redes.categoryId,
    },
    // Armazenamento
    {
      productName: "SSD NVMe 1TB",
      productPrice: 390.0,
      stock: 40,
      productDescription:
        "SSD interno no formato M.2 2280 com interface PCIe 4.0 x4 (NVMe 1.4) e velocidades de leitura sequencial de até 7.000 MB/s e gravação de até 6.500 MB/s — até 13× mais rápido que um SSD SATA comum. Memória flash NAND TLC 3D de última geração com cache SLC dinâmico. Suporta até 600 TBW (terabytes escritos) de vida útil. Compatível com PS5 e PCs desktop/notebook com slot M.2 PCIe 4.0. Inclui dissipador de alumínio slim. Garantia de 5 anos.",
      isFeatured: true,
      categoryId: armazenamento.categoryId,
    },
    {
      productName: "HD Externo 2TB USB 3.2",
      productPrice: 310.0,
      stock: 28,
      productDescription:
        "HD externo portátil de 2TB com interface USB 3.2 Gen 1 (5 Gbps) para transferências rápidas de arquivos grandes. Gabinete slim de apenas 13,5mm, compatível com Windows, macOS e Linux sem necessidade de drivers adicionais. Acompanha cabo USB-C para USB-A e adaptador USB-C para USB-C. Alimentado diretamente pela porta USB — sem fonte externa. Sistema de proteção contra queda de até 1,2m. Ideal para backup de fotos, vídeos 4K e arquivos de trabalho.",
      isFeatured: false,
      categoryId: armazenamento.categoryId,
    },
  ];

  const products = await Promise.all(
    productsData.map((p) => prisma.product.create({ data: p })),
  );

  console.log(`📦 ${products.length} produtos criados.`);

  // Aliases para facilitar referências abaixo
  const [
    mouseGamer, // 0
    tecladoMec, // 1
    mousepadXXL, // 2
    webcam, // 3
    monitor4k, // 4
    monitorFHD, // 5
    headset, // 6
    caixaSom, // 7
    cadeiraGamer, // 8
    cadeiraEsc, // 9
    roteador, // 10
    switchGigabit, // 11
    ssdNVMe, // 12
    hdExterno, // 13
  ] = products;

  // ------------------------------------------------------------
  // Imagens dos produtos (primária + secundária para alguns)
  // ------------------------------------------------------------
  await prisma.productImage.createMany({
    data: [
      // Mouse Gamer RGB
      {
        productId: mouseGamer.productId,
        url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
        isPrimary: true,
      },
      {
        productId: mouseGamer.productId,
        url: "https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=800",
        isPrimary: false,
      },
      {
        productId: mouseGamer.productId,
        url: "https://images.unsplash.com/photo-1613141411244-0e4ac259d45d?w=800",
        isPrimary: false,
      },

      // Teclado Mecânico TKL
      {
        productId: tecladoMec.productId,
        url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800",
        isPrimary: true,
      },
      {
        productId: tecladoMec.productId,
        url: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800",
        isPrimary: false,
      },
      {
        productId: tecladoMec.productId,
        url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
        isPrimary: false,
      },

      // Mousepad XXL com RGB
      {
        productId: mousepadXXL.productId,
        url: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800",
        isPrimary: true,
      },
      {
        productId: mousepadXXL.productId,
        url: "https://images.unsplash.com/photo-1593640408182-31c228fa00b0?w=800",
        isPrimary: false,
      },
      {
        productId: mousepadXXL.productId,
        url: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800",
        isPrimary: false,
      },

      // Webcam Full HD
      {
        productId: webcam.productId,
        url: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800",
        isPrimary: true,
      },
      {
        productId: webcam.productId,
        url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
        isPrimary: false,
      },
      {
        productId: webcam.productId,
        url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
        isPrimary: false,
      },

      // Monitor 27" 4K 144Hz
      {
        productId: monitor4k.productId,
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        isPrimary: true,
      },
      {
        productId: monitor4k.productId,
        url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800",
        isPrimary: false,
      },
      {
        productId: monitor4k.productId,
        url: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800",
        isPrimary: false,
      },

      // Monitor 24" Full HD
      {
        productId: monitorFHD.productId,
        url: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800",
        isPrimary: true,
      },
      {
        productId: monitorFHD.productId,
        url: "https://images.unsplash.com/photo-1536148935331-408321065b18?w=800",
        isPrimary: false,
      },
      {
        productId: monitorFHD.productId,
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        isPrimary: false,
      },

      // Headset Sem Fio 7.1
      {
        productId: headset.productId,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        isPrimary: true,
      },
      {
        productId: headset.productId,
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
        isPrimary: false,
      },
      {
        productId: headset.productId,
        url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
        isPrimary: false,
      },

      // Caixa de Som Bluetooth
      {
        productId: caixaSom.productId,
        url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
        isPrimary: true,
      },
      {
        productId: caixaSom.productId,
        url: "https://images.unsplash.com/photo-1589491106922-a8a76b5bb9ff?w=800",
        isPrimary: false,
      },
      {
        productId: caixaSom.productId,
        url: "https://images.unsplash.com/photo-1530545236041-cd96b5a02f74?w=800",
        isPrimary: false,
      },

      // Cadeira Gamer Pro
      {
        productId: cadeiraGamer.productId,
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
        isPrimary: true,
      },
      {
        productId: cadeiraGamer.productId,
        url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
        isPrimary: false,
      },
      {
        productId: cadeiraGamer.productId,
        url: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=800",
        isPrimary: false,
      },

      // Cadeira de Escritório
      {
        productId: cadeiraEsc.productId,
        url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
        isPrimary: true,
      },
      {
        productId: cadeiraEsc.productId,
        url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
        isPrimary: false,
      },
      {
        productId: cadeiraEsc.productId,
        url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800",
        isPrimary: false,
      },

      // Roteador Wi-Fi 6
      {
        productId: roteador.productId,
        url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800",
        isPrimary: true,
      },
      {
        productId: roteador.productId,
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        isPrimary: false,
      },
      {
        productId: roteador.productId,
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
        isPrimary: false,
      },

      // Switch 8 Portas Gigabit
      {
        productId: switchGigabit.productId,
        url: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800",
        isPrimary: true,
      },
      {
        productId: switchGigabit.productId,
        url: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800",
        isPrimary: false,
      },
      {
        productId: switchGigabit.productId,
        url: "https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?w=800",
        isPrimary: false,
      },

      // SSD NVMe 1TB
      {
        productId: ssdNVMe.productId,
        url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
        isPrimary: true,
      },
      {
        productId: ssdNVMe.productId,
        url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800",
        isPrimary: false,
      },
      {
        productId: ssdNVMe.productId,
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        isPrimary: false,
      },

      // HD Externo 2TB
      {
        productId: hdExterno.productId,
        url: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800",
        isPrimary: true,
      },
      {
        productId: hdExterno.productId,
        url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800",
        isPrimary: false,
      },
      {
        productId: hdExterno.productId,
        url: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800",
        isPrimary: false,
      },
    ],
  });

  console.log("🖼️  Imagens dos produtos criadas.");

  // ------------------------------------------------------------
  // Carrinhos + CartItems
  // ------------------------------------------------------------

  // Carrinho do João (itens pendentes, ainda não virou pedido)
  const cartJoao = await prisma.cart.create({
    data: { userId: user1.userId },
  });
  await prisma.cartItem.createMany({
    data: [
      { cartId: cartJoao.cartId, productId: ssdNVMe.productId, quantity: 1 },
      {
        cartId: cartJoao.cartId,
        productId: mousepadXXL.productId,
        quantity: 2,
      },
    ],
  });

  // Carrinho da Maria (1 item)
  const cartMaria = await prisma.cart.create({
    data: { userId: user2.userId },
  });
  await prisma.cartItem.createMany({
    data: [
      { cartId: cartMaria.cartId, productId: headset.productId, quantity: 1 },
      { cartId: cartMaria.cartId, productId: caixaSom.productId, quantity: 1 },
    ],
  });

  // Carrinho do Pedro (vazio — apenas o registro existe)
  await prisma.cart.create({
    data: { userId: user3.userId },
  });

  console.log("🛒 Carrinhos criados.");

  // ------------------------------------------------------------
  // Pedidos + OrderItems
  // ------------------------------------------------------------

  // --- Pedido 1: João, DELIVERED ---
  const order1 = await prisma.order.create({
    data: {
      userId: user1.userId,
      addressId: addr1.addressId,
      status: Status.DELIVERED,
      total: mouseGamer.productPrice,
      paymentLink: null,
      createdAt: new Date("2026-03-10T10:00:00Z"),
      updatedAt: new Date("2026-03-15T14:30:00Z"),
    },
  });
  await prisma.orderItem.create({
    data: {
      orderId: order1.orderId,
      productId: mouseGamer.productId,
      quantity: 1,
      priceAtTime: mouseGamer.productPrice,
    },
  });

  // --- Pedido 2: João, PAID (monitor + headset) ---
  const order2Total =
    Number(monitor4k.productPrice) + Number(headset.productPrice);
  const order2 = await prisma.order.create({
    data: {
      userId: user1.userId,
      addressId: addr1b.addressId,
      status: Status.PAID,
      total: order2Total,
      paymentLink: "https://pagamento.exemplo.com/order/2",
      createdAt: new Date("2026-05-01T09:15:00Z"),
      updatedAt: new Date("2026-05-01T09:20:00Z"),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order2.orderId,
        productId: monitor4k.productId,
        quantity: 1,
        priceAtTime: monitor4k.productPrice,
      },
      {
        orderId: order2.orderId,
        productId: headset.productId,
        quantity: 1,
        priceAtTime: headset.productPrice,
      },
    ],
  });

  // --- Pedido 3: Maria, ONGOING (cadeira gamer) ---
  const order3 = await prisma.order.create({
    data: {
      userId: user2.userId,
      addressId: addr2.addressId,
      status: Status.ONGOING,
      total: cadeiraGamer.productPrice,
      paymentLink: "https://pagamento.exemplo.com/order/3",
      createdAt: new Date("2026-05-20T16:45:00Z"),
      updatedAt: new Date("2026-05-21T08:00:00Z"),
    },
  });
  await prisma.orderItem.create({
    data: {
      orderId: order3.orderId,
      productId: cadeiraGamer.productId,
      quantity: 1,
      priceAtTime: cadeiraGamer.productPrice,
    },
  });

  // --- Pedido 4: Maria, PENDING (teclado + mousepad) ---
  const order4Total =
    Number(tecladoMec.productPrice) + Number(mousepadXXL.productPrice) * 2;
  const order4 = await prisma.order.create({
    data: {
      userId: user2.userId,
      addressId: addr2.addressId,
      status: Status.PENDING,
      total: order4Total,
      paymentLink: "https://pagamento.exemplo.com/order/4",
      createdAt: new Date("2026-06-05T11:00:00Z"),
      updatedAt: new Date("2026-06-05T11:00:00Z"),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order4.orderId,
        productId: tecladoMec.productId,
        quantity: 1,
        priceAtTime: tecladoMec.productPrice,
      },
      {
        orderId: order4.orderId,
        productId: mousepadXXL.productId,
        quantity: 2,
        priceAtTime: mousepadXXL.productPrice,
      },
    ],
  });

  // --- Pedido 5: Pedro, CANCELLED (roteador) ---
  const order5 = await prisma.order.create({
    data: {
      userId: user3.userId,
      addressId: addr3.addressId,
      status: Status.CANCELLED,
      total: roteador.productPrice,
      paymentLink: null,
      createdAt: new Date("2026-04-12T08:30:00Z"),
      updatedAt: new Date("2026-04-12T10:00:00Z"),
    },
  });
  await prisma.orderItem.create({
    data: {
      orderId: order5.orderId,
      productId: roteador.productId,
      quantity: 1,
      priceAtTime: roteador.productPrice,
    },
  });

  // --- Pedido 6: Pedro, DELIVERED (HD externo + SSD) ---
  const order6Total =
    Number(hdExterno.productPrice) + Number(ssdNVMe.productPrice);
  const order6 = await prisma.order.create({
    data: {
      userId: user3.userId,
      addressId: addr3.addressId,
      status: Status.DELIVERED,
      total: order6Total,
      paymentLink: null,
      createdAt: new Date("2026-02-18T14:00:00Z"),
      updatedAt: new Date("2026-02-25T09:00:00Z"),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order6.orderId,
        productId: hdExterno.productId,
        quantity: 1,
        priceAtTime: hdExterno.productPrice,
      },
      {
        orderId: order6.orderId,
        productId: ssdNVMe.productId,
        quantity: 1,
        priceAtTime: ssdNVMe.productPrice,
      },
    ],
  });

  // --- Pedido 7: Admin comprando para estoque/teste, PAID ---
  const order7Total = Number(webcam.productPrice) * 3;
  const order7 = await prisma.order.create({
    data: {
      userId: admin.userId,
      addressId: addrAdmin.addressId,
      status: Status.PAID,
      total: order7Total,
      paymentLink: "https://pagamento.exemplo.com/order/7",
      createdAt: new Date("2026-06-01T12:00:00Z"),
      updatedAt: new Date("2026-06-01T12:05:00Z"),
    },
  });
  await prisma.orderItem.create({
    data: {
      orderId: order7.orderId,
      productId: webcam.productId,
      quantity: 3,
      priceAtTime: webcam.productPrice,
    },
  });

  console.log("🧾 Pedidos e itens de pedido criados.");

  // ------------------------------------------------------------
  // Resumo final
  // ------------------------------------------------------------
  console.log("\n✅ Seed concluída com sucesso!");
  console.log("─────────────────────────────────────────────────────────");
  console.log("🔑 Admin  → admin@loja.com   / admin123");
  console.log("🔑 User 1 → joao@email.com   / user123");
  console.log("🔑 User 2 → maria@email.com  / maria123");
  console.log("🔑 User 3 → pedro@email.com  / pedro123");
  console.log("─────────────────────────────────────────────────────────");
  console.log(`📊 Resumo:`);
  console.log(`   Usuários:       4  (1 admin + 3 users)`);
  console.log(`   RefreshTokens:  3`);
  console.log(`   Endereços:      5`);
  console.log(`   Categorias:     6`);
  console.log(`   Produtos:      14`);
  console.log(`   Imagens:       42  (3 por produto)`);
  console.log(`   Carrinhos:      3  (2 com itens, 1 vazio)`);
  console.log(`   CartItems:      4`);
  console.log(
    `   Pedidos:        7  (DELIVERED×2, PAID×2, ONGOING×1, PENDING×1, CANCELLED×1)`,
  );
  console.log(`   OrderItems:    11`);
  console.log("─────────────────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Erro na seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
