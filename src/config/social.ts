type SocialConfig = { url: string; name: string; iconPath: string };

function createSocialConfig(name: string, url: string): SocialConfig {
  return {
    name,
    url,
    iconPath: `/images/social/${name.toLowerCase()}.svg`,
  };
}

export const socialConfig: SocialConfig[] = [
  createSocialConfig("Github", "https://github.com/ktondao"),
  createSocialConfig("Discord", "https://discord.com/invite/VcYFYETrw5"),
];
