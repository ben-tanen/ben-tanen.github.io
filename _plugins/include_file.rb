module Jekyll
  class IncludeFileTag < Liquid::Tag
    def initialize(tag_name, path, tokens)
      super
      @path = path.strip
    end

    def render(context)
      site = context.registers[:site]
      file_path = File.join(site.source, @path)
      unless File.exist?(file_path)
        raise "include_file: #{file_path} not found"
      end
      File.read(file_path)
    end
  end
end

Liquid::Template.register_tag('include_file', Jekyll::IncludeFileTag)
